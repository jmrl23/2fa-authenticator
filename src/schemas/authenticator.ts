import z from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export const authenticatorListSchema = z.object({
  platform: z
    .string({
      message: 'platform must be a string',
    })
    .min(1, {
      message: 'platform must contain at least 1 character(s)',
    })
    .optional(),
  description: z
    .string({
      message: 'description must be a string',
    })
    .min(1, {
      message: 'description must contain at least 1 character(s)',
    })
    .optional(),
  order: z
    .enum(['asc', 'desc'], {
      message: 'order values could only be `asc`, or `desc`',
    })
    .optional(),
});

export const authenticatorListJsonSchema = zodToJsonSchema(
  authenticatorListSchema,
);

export const authenticatorCreateSchema = z.object({
  key: z
    .string({
      message: 'key must be a string',
    })
    .min(1, {
      message: 'key must contain at least 1 character(s)',
    }),
  platform: z
    .string({
      message: 'platform must be a string',
    })
    .min(1, {
      message: 'platform must contain at least 1 character(s)',
    }),
  description: z
    .string({
      message: 'description must be a string',
    })
    .min(1, {
      message: 'description must contain at least 1 character(s)',
    })
    .optional(),
});

export const authenticatorCreateJsonSchema = zodToJsonSchema(
  authenticatorCreateSchema,
);

export const authenticatorUpdateSchema = z.object({
  id: z
    .string({
      message: 'id must be a string',
    })
    .uuid({
      message: 'id must be in uuid format',
    }),
  key: z
    .string({
      message: 'key must be a string',
    })
    .min(1, {
      message: 'key must contain at least 1 character(s)',
    })
    .optional(),
  platform: z
    .string({
      message: 'platform must be a string',
    })
    .min(1, {
      message: 'platform must contain at least 1 character(s)',
    })
    .optional(),
  description: z
    .string({
      message: 'description must be a string',
    })
    .min(1, {
      message: 'description must contain at least 1 character(s)',
    })
    .optional(),
});

export const authenticatorUpdateJsonSchema = zodToJsonSchema(
  authenticatorUpdateSchema,
);

export const authenticatorDeleteSchema = z.object({
  id: z
    .string({
      message: 'id must be a string',
    })
    .uuid({
      message: 'id must be in uuid format',
    }),
});

export const authenticatorDeleteJsonSchema = zodToJsonSchema(
  authenticatorDeleteSchema,
);
