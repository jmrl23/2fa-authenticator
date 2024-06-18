import { validate } from '@/lib/server/ajv';
import cache from '@/lib/server/cache';
import prismaClient from '@/lib/server/prismaClient';
import { handler } from '@/lib/server/utils';
import {
  authenticatorDeleteJsonSchema,
  type authenticatorDeleteSchema,
} from '@/schemas/authenticator';
import { BadRequest, NotFound } from 'http-errors';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

export const DELETE = handler<{
  authenticator: Authenticator;
}>(async function (request: NextRequest) {
  const data: z.infer<typeof authenticatorDeleteSchema> = {
    id: request.nextUrl.pathname.split('/').at(-1) ?? '',
  };
  const { error, valid } = validate(authenticatorDeleteJsonSchema, data);
  if (!valid) throw new BadRequest(error);
  try {
    const authenticator = await prismaClient.authenticator.delete({
      where: {
        id: data.id,
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
    const cacheKeys = await authenticatorCache.store.keys(
      'authenticator:list:*',
    );
    await authenticatorCache.store.mdel(...cacheKeys);

    return NextResponse.json({
      authenticator,
    });
  } catch (error) {
    throw new NotFound('Authenticator not found');
  }
});
