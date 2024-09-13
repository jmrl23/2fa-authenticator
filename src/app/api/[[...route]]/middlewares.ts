import { getAuthKey } from '@/app/api/utils';
import { Context, Next } from 'hono';
import { Unauthorized } from 'http-errors';

export async function requiredAuthKey(ctx: Context, next: Next) {
  const authKey = getAuthKey(ctx);
  if (!authKey) throw new Unauthorized();
  await next();
}
