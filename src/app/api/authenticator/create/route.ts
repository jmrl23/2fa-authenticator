import { validate } from '@/lib/server/ajv';
import cache from '@/lib/server/cache';
import prismaClient from '@/lib/server/prismaClient';
import { handler } from '@/lib/server/utils';
import {
  authenticatorCreateJsonSchema,
  type authenticatorCreateSchema,
} from '@/schemas/authenticator';
import { BadRequest } from 'http-errors';
import { type NextRequest, NextResponse } from 'next/server';
import type { z } from 'zod';

export const POST = handler<{
  authenticator: Authenticator;
}>(async function post(request: NextRequest) {
  const data: z.infer<typeof authenticatorCreateSchema> = await request.json();
  const { error, valid } = validate(authenticatorCreateJsonSchema, data);
  if (!valid) throw new BadRequest(error);

  const authenticator = await prismaClient.authenticator.create({
    data: {
      key: data.key,
      platform: data.platform,
      description: data.description,
    },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      platform: true,
      description: true,
    },
  });

  const { authenticatorCache } = await cache;
  const cacheKeys = await authenticatorCache.store.keys('authenticator:list:*');
  await authenticatorCache.store.mdel(...cacheKeys);

  return NextResponse.json({
    authenticator,
  });
});
