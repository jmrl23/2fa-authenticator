import { requiredAuthKey } from '@/app/api/[[...route]]/middlewares';
import {
  authenticatorCreateSchema,
  authenticatorUpdateSchema,
} from '@/app/api/[[...route]]/modules/authenticators/authenticatorsSchema';
import { AuthenticatorsService } from '@/app/api/[[...route]]/modules/authenticators/authenticatorsService';
import { validate } from '@/app/api/ajv';
import { getAuthKey } from '@/app/api/utils';
import { Hono } from 'hono';
import { BadRequest } from 'http-errors';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const app = new Hono();

export default function authenticatorsRoute(
  authenticatorsService: AuthenticatorsService,
) {
  app

    .use(requiredAuthKey)

    .post('/create', async function (ctx) {
      const body = await ctx.req.json();
      const schema = zodToJsonSchema(authenticatorCreateSchema);
      const { error, valid } = validate(schema, body);
      if (!valid) throw new BadRequest(error);
      const authKey = getAuthKey(ctx)!;
      const authenticator = await authenticatorsService.createAuthenticator(
        authKey,
        body as z.infer<typeof authenticatorCreateSchema>,
      );
      return ctx.json({
        data: authenticator,
      });
    })

    .get('/', async function (ctx) {
      const authKey = getAuthKey(ctx)!;
      const authenticators =
        await authenticatorsService.getAuthenticators(authKey);
      return ctx.json({
        data: authenticators,
      });
    })

    .patch('/update', async function (ctx) {
      const body = await ctx.req.json();
      const schema = zodToJsonSchema(authenticatorUpdateSchema);
      const { error, valid } = validate(schema, body);
      if (!valid) throw new BadRequest(error);
      const authKey = getAuthKey(ctx)!;
      const authenticator = await authenticatorsService.updateAuthenticator(
        authKey,
        body as z.infer<typeof authenticatorUpdateSchema>,
      );
      return ctx.json({
        data: authenticator,
      });
    })

    .delete('/delete/:id', async function (ctx) {
      const id = ctx.req.param().id;
      const authKey = getAuthKey(ctx)!;
      const authenticator = await authenticatorsService.deleteAuthenticator(
        authKey,
        id,
      );
      return ctx.json({
        data: authenticator,
      });
    });

  return app;
}
