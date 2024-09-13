import z from 'zod';

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
