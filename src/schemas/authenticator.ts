import z from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export const authenticatorCreateSchema = z.object({
  key: z.string().min(1),
  platform: z.string().min(1),
  description: z.string().min(1).optional(),
});

export const authenticatorCreateJsonSchema = zodToJsonSchema(
  authenticatorCreateSchema,
);
