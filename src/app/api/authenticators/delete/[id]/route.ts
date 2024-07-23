import { validate } from '@/lib/server/ajv';
import cache from '@/lib/server/cache';
import prismaClient from '@/lib/server/prismaClient';
import { getAuthKey, handler } from '@/lib/server/utils';
import {
  authenticatorDeleteJsonSchema,
  type authenticatorDeleteSchema,
} from '@/schemas/authenticator';
import { BadRequest, NotFound } from 'http-errors';
import { NextResponse, type NextRequest } from 'next/server';
import * as otplib from 'otplib';
import { z } from 'zod';

export const DELETE = handler<{
  authenticator: Authenticator;
}>(async function (request: NextRequest) {
  const data: z.infer<typeof authenticatorDeleteSchema> = {
    id: request.nextUrl.pathname.split('/').at(-1) ?? '',
  };
  const { error, valid } = validate(authenticatorDeleteJsonSchema, data);
  if (!valid) throw new BadRequest(error);
  const authKey = getAuthKey(request)!;
  try {
    const authenticator = await prismaClient.authenticator.delete({
      where: {
        authKey,
        id: data.id,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        platform: true,
        description: true,
        key: true,
      },
    });

    const authenticatorWithCode: Authenticator & Record<string, unknown> = {
      ...authenticator,
      code: otplib.authenticator.generate(authenticator.key),
    };
    delete authenticatorWithCode.key;

    const { authenticatorCache } = await cache;
    const cacheKeys = await authenticatorCache.store.keys(
      `authenticator:${authKey}:list:*`,
    );
    await authenticatorCache.store.mdel(...cacheKeys);

    return NextResponse.json({
      authenticator: authenticatorWithCode,
    });
  } catch (error) {
    throw new NotFound('Authenticator not found');
  }
});
