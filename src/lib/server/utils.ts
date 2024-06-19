import { HttpError, InternalServerError } from 'http-errors';
import { type NextRequest, NextResponse } from 'next/server';

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

interface HandlerFn<T> {
  (...args: any[]): Promise<NextResponse<T>> | NextResponse<T>;
}

export function handler<T>(
  fn: HandlerFn<T>,
): (...args: any[]) => Promise<NextResponse<any | ResponseErrorType>> {
  return async function wrappedHandler(...args: any[]) {
    try {
      return await Promise.resolve(fn(...args));
    } catch (error) {
      if (error instanceof Error && !(error instanceof HttpError)) {
        error = new InternalServerError(error.message);
      }
      if (
        !(error instanceof HttpError) ||
        (error instanceof HttpError && error.statusCode > 499)
      ) {
        console.error(error);
      }
      if (error instanceof HttpError) return responseError(error);
      return responseError(new InternalServerError('An error occurs'));
    }
  };
}

export function getAuthKey(request: NextRequest): string | null {
  if (!request.headers.has('authorization')) return null;
  const [scheme, key] = request.headers.get('authorization')?.split(' ') ?? [];
  if (scheme !== 'Bearer' || key === undefined) return null;
  return key;
}
