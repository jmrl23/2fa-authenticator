import { Context } from 'hono';
import { HttpError } from 'http-errors';
import { NextResponse } from 'next/server';

export function responseError({
  statusCode,
  message,
  name: error,
}: HttpError): NextResponse<ResponseErrorType> {
  return NextResponse.json(
    { statusCode, message, error },
    { status: statusCode },
  );
}

export function getAuthKey({ req }: Context): string | undefined {
  const [scheme, authKey] = req.header().authorization?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !authKey) return undefined;
  return authKey;
}
