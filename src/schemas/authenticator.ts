import z from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export const authenticatorListSchema = z.object({
  platform: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export const authenticatorListJsonSchema = zodToJsonSchema(
  authenticatorListSchema,
);

export const authenticatorCreateSchema = z.object({
  key: z.string().min(1),
  platform: z.string().min(1),
  description: z.string().min(1).optional(),
});

export const authenticatorCreateJsonSchema = zodToJsonSchema(
  authenticatorCreateSchema,
);

export const authenticatorUpdateSchema = z.object({
  id: z.string().uuid(),
  key: z.string().min(1).optional(),
  platform: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});

export const authenticatorUpdateJsonSchema = zodToJsonSchema(
  authenticatorUpdateSchema,
);

export const authenticatorDeleteSchema = z.object({
  id: z.string().uuid(),
});

export const authenticatorDeleteJsonSchema = zodToJsonSchema(
  authenticatorDeleteSchema,
);
