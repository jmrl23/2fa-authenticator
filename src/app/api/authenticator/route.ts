import cache from '@/lib/server/cache';
import { handler } from '@/lib/server/utils';
import { NextResponse } from 'next/server';
import prismaClient from '@/lib/server/prismaClient';

export const GET = handler<{
  authenticators: Authenticator[];
}>(async function get() {
  const { authenticatorCache } = await cache;
  const cacheKey = `authenticator:list`;
  const cachedData = await authenticatorCache.get<Authenticator[]>(cacheKey);

  if (cachedData) {
    return NextResponse.json({
      authenticators: cachedData,
    });
  }

  const authenticators = await prismaClient.authenticator.findMany({
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      platform: true,
      description: true,
    },
  });

  await authenticatorCache.set(cacheKey, authenticators);

  return NextResponse.json({
    authenticators,
  });
});
