import env from 'env-var';

export const AUTH_KEY = env.get('AUTH_KEY').required().asString();
