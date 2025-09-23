import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['server.ts'],
  format: ['cjs'],
  target: 'node18',
  outDir: '../dist/server',
  clean: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  dts: false,
  external: [
    'express',
    'cors',
    'helmet',
    'morgan',
    'dotenv',
    '@prisma/client'
  ],
  noExternal: [],
  env: {
    NODE_ENV: 'development'
  }
});