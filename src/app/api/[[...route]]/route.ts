import { PrismaClient } from '@prisma/client';
import { caching, memoryStore } from 'cache-manager';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import ms from 'ms';
import authenticatorsRoute from './modules/authenticators/authenticatorsRoute';
import { AuthenticatorsService } from './modules/authenticators/authenticatorsService';
import { responseError } from '@/app/api/utils';
import { InternalServerError, NotFound, HttpError } from 'http-errors';

// export const runtime = 'edge';

const app = new Hono().basePath('/api');
const prismaClient = new PrismaClient();

async function main() {
  const cache = await caching(memoryStore({ ttl: ms('30s') }));
  const authenticatorsService = new AuthenticatorsService(cache, prismaClient);

  app.route('/authenticators', authenticatorsRoute(authenticatorsService));

  app.notFound((ctx) => {
    throw new NotFound(`Cannot ${ctx.req.method} ${ctx.req.path}`);
  });
  app.onError((error) => {
    console.error(error);
    if (error instanceof Error && !(error instanceof HttpError))
      error = new InternalServerError(error.message);
    if (error instanceof HttpError) return responseError(error);
    return responseError(new InternalServerError('An error occurs'));
  });
}

void main();

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
