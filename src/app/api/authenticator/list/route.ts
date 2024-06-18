import { validate } from '@/lib/server/ajv';
import cache from '@/lib/server/cache';
import prismaClient from '@/lib/server/prismaClient';
import { handler } from '@/lib/server/utils';
import {
  authenticatorListJsonSchema,
  type authenticatorListSchema,
} from '@/schemas/authenticator';
import { BadRequest } from 'http-errors';
import { type NextRequest, NextResponse } from 'next/server';
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
  const cacheKey = `authenticator:list:${JSON.stringify(data)}`;
  const cachedData = await authenticatorCache.get<Authenticator[]>(cacheKey);

  if (cachedData) {
    return NextResponse.json({
      authenticators: cachedData,
    });
  }

  const authenticators = await prismaClient.authenticator.findMany({
    where: {
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
    },
    orderBy: {
      createdAt: data.order,
    },
  });

  await authenticatorCache.set(cacheKey, authenticators);

  return NextResponse.json({
    authenticators,
  });
});
