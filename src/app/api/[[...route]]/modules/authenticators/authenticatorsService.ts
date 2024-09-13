import {
  authenticatorCreateSchema,
  authenticatorUpdateSchema,
} from '@/app/api/[[...route]]/modules/authenticators/authenticatorsSchema';
import { Prisma, PrismaClient } from '@prisma/client';
import { Cache } from 'cache-manager';
import z from 'zod';
import * as otplib from 'otplib';

export type Authenticator = Prisma.AuthenticatorGetPayload<{
  select: {
    id: true;
    description: true;
    key: true;
  };
}> & {
  createdAt: string;
  updatedAt: string;
  code?: string;
};

export class AuthenticatorsService {
  constructor(
    private readonly cache: Cache,
    private readonly prismaClient: PrismaClient,
  ) {}

  public async createAuthenticator(
    authKey: string,
    body: z.infer<typeof authenticatorCreateSchema>,
  ): Promise<Authenticator> {
    body.key = body.key.split(' ').join('');
    const authenticator = await this.prismaClient.authenticator.create({
      data: { ...body, authKey },
    });
    await this.resetCachedList(authKey);
    return AuthenticatorsService.serializeAuthenticator(authenticator);
  }

  public async getAuthenticators(authKey: string): Promise<Authenticator[]> {
    const cacheKey = `authenticators:[ref:authKey]:${authKey}`;
    const cachedList = await this.cache.get<Authenticator[]>(cacheKey);
    if (cachedList !== undefined) return cachedList;
    const authenticators = await this.prismaClient.authenticator.findMany({
      where: {
        authKey,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const serializedAuthenticators = authenticators.map((authenticator) => {
      const code = otplib.authenticator.generate(authenticator.key);
      return AuthenticatorsService.serializeAuthenticator({
        ...authenticator,
        code,
      });
    });
    await this.cache.set(cacheKey, serializedAuthenticators);
    return serializedAuthenticators;
  }

  public async updateAuthenticator(
    authKey: string,
    body: z.infer<typeof authenticatorUpdateSchema>,
  ): Promise<Authenticator> {
    if (body.key !== undefined) {
      body.key = body.key.split(' ').join('');
    }
    const { id, ...rest } = body;
    const authenticator = await this.prismaClient.authenticator.update({
      where: {
        id,
        authKey,
      },
      data: rest,
    });
    await this.resetCachedList(authKey);
    return AuthenticatorsService.serializeAuthenticator(authenticator);
  }

  public async deleteAuthenticator(
    authKey: string,
    id: string,
  ): Promise<Authenticator> {
    const authenticator = await this.prismaClient.authenticator.delete({
      where: {
        authKey,
        id,
      },
    });
    await this.resetCachedList(authKey);
    return AuthenticatorsService.serializeAuthenticator(authenticator);
  }

  private async resetCachedList(authKey: string): Promise<void> {
    await this.cache.del(`authenticators:[ref:authKey]:${authKey}`);
  }

  public static serializeAuthenticator(
    authenticator: Prisma.AuthenticatorGetPayload<{
      select: {
        id: true;
        createdAt: true;
        updatedAt: true;
        description: true;
        key: true;
      };
    }> & { authKey?: string; code?: string },
  ): Authenticator {
    const auth = {
      ...authenticator,
      createdAt: new Date(authenticator.createdAt).toISOString(),
      updatedAt: new Date(authenticator.updatedAt).toISOString(),
    };
    delete auth.authKey;
    return auth;
  }
}
