import { validate } from '@/lib/server/ajv';
import cache from '@/lib/server/cache';
import prismaClient from '@/lib/server/prismaClient';
import { getAuthKey, handler } from '@/lib/server/utils';
import {
  authenticatorCreateJsonSchema,
  type authenticatorCreateSchema,
} from '@/schemas/authenticator';
import { BadRequest } from 'http-errors';
import { type NextRequest, NextResponse } from 'next/server';
import * as otplib from 'otplib';
import type { z } from 'zod';

export const POST = handler<{
  authenticator: Authenticator;
}>(async function post(request: NextRequest) {
  const data: z.infer<typeof authenticatorCreateSchema> = await request.json();
  const authKey = getAuthKey(request)!;
  const { error, valid } = validate(authenticatorCreateJsonSchema, data);
  if (!valid) throw new BadRequest(error);

  const authenticator = await prismaClient.authenticator.create({
    data: {
      authKey,
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
});
