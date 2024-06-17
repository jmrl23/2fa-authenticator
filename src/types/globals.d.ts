import type { Prisma } from '@prisma/client';

export declare global {
  interface Authenticator
    extends Prisma.AuthenticatorGetPayload<{
      select: {
        id: true;
        createdAt: true;
        updatedAt: true;
        platform: true;
        description: true;
      };
    }> {}

  interface ResponseErrorType {
    statusCode: number;
    message: string;
    error: string;
  }
}
