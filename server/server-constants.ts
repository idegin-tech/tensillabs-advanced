import { env } from './helpers/env.helper';

export const AUTH_SECRET = env.AUTH_SECRET;
export const PORT = env.PORT;
export const IS_PRODUCTION = env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = !IS_PRODUCTION;