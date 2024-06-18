import { validate } from '@/lib/server/ajv';
import cache from '@/lib/server/cache';
import prismaClient from '@/lib/server/prismaClient';
import { handler } from '@/lib/server/utils';
import {
  authenticatorUpdateJsonSchema,
  type authenticatorUpdateSchema,
} from '@/schemas/authenticator';
import { BadRequest, NotFound } from 'http-errors';
import { type NextRequest, NextResponse } from 'next/server';
import * as otplib from 'otplib';
import type { z } from 'zod';

export const PATCH = handler<{
  authenticator: Authenticator;
}>(async function patch(request: NextRequest) {
  const data: z.infer<typeof authenticatorUpdateSchema> = await request.json();
  const { error, valid } = validate(authenticatorUpdateJsonSchema, data);
  if (!valid) throw new BadRequest(error);
  try {
    const authenticator = await prismaClient.authenticator.update({
      where: {
        id: data.id,
      },
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
      'authenticator:list:*',
    );
    await authenticatorCache.store.mdel(...cacheKeys);

    return NextResponse.json({
      authenticator: authenticatorWithCode,
    });
  } catch (error) {
    throw new NotFound('Authenticator not found');
  }
});
