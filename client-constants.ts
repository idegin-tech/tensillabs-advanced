export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = !IS_PRODUCTION;
export const IS_TEST = process.env.NODE_ENV === 'test';

export const APP_NAME = 'TensilLabs';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';