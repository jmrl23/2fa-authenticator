import { validate } from '@/lib/server/ajv';
import cache from '@/lib/server/cache';
import prismaClient from '@/lib/server/prismaClient';
import { getAuthKey, handler } from '@/lib/server/utils';
import {
  authenticatorListJsonSchema,
  type authenticatorListSchema,
} from '@/schemas/authenticator';
import { BadRequest } from 'http-errors';
import { type NextRequest, NextResponse } from 'next/server';
import * as otplib from 'otplib';
import qs from 'qs';
import type { z } from 'zod';

export const GET = handler<{
  authenticators: Authenticator[];
}>(async function get(request: NextRequest) {
  const data: z.infer<typeof authenticatorListSchema> = qs.parse(
    request.nextUrl.searchParams.toString(),
  );
  const { error, valid } = validate(authenticatorListJsonSchema, data);
  if (!valid) throw new BadRequest(error);
  const { authenticatorCache } = await cache;
  const authKey = getAuthKey(request)!;
  const cacheKey = `authenticator:${authKey}:list:${JSON.stringify(data)}`;
  const cachedData = await authenticatorCache.get<Authenticator[]>(cacheKey);

  if (cachedData) {
    return NextResponse.json({
      authenticators: cachedData,
    });
  }

  const authenticators = await prismaClient.authenticator.findMany({
    where: {
      authKey,
      platform: {
        contains: data.platform,
      },
      description: {
        contains: data.description,
      },
    },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      platform: true,
      description: true,
      key: true,
    },
    orderBy: {
      createdAt: data.order,
    },
  });

  const authenticatorsWithCode: Authenticator[] = authenticators.map(
    (authenticator) => {
      const authenticatorWithCode: Authenticator & Record<string, unknown> = {
        ...authenticator,
        code: otplib.authenticator.generate(authenticator.key),
      };
      delete authenticatorWithCode.key;
      return authenticatorWithCode;
    },
  );

  await authenticatorCache.set(cacheKey, authenticatorsWithCode);

  return NextResponse.json({
    authenticators: authenticatorsWithCode,
  });
});
