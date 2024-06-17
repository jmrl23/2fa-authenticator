import { validate } from '@/lib/server/ajv';
import cache from '@/lib/server/cache';
import prismaClient from '@/lib/server/prismaClient';
import { handler } from '@/lib/server/utils';
import { authenticatorCreateJsonSchema } from '@/schemas/authenticator';
import { BadRequest } from 'http-errors';
import { type NextRequest, NextResponse } from 'next/server';

export const POST = handler<{
  authenticator: Authenticator;
}>(async function post(request: NextRequest) {
  const data = await request.json();
  const { error, valid } = validate(authenticatorCreateJsonSchema, data);
  if (!valid) throw new BadRequest(error);

  const authenticator = await prismaClient.authenticator.create({
    data: {
      key: data.key,
      platform: data.platform,
      description: data.description,
    },
  });

  const { authenticatorCache } = await cache;
  await authenticatorCache.del('authenticator:list');

  return NextResponse.json({
    authenticator,
  });
});
