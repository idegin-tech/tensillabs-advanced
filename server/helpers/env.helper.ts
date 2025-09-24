import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('8080'),
  DATABASE_URL: z.string(),
  AUTH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  MICROSOFT_CLIENT_ID: z.string().optional(),
  MICROSOFT_CLIENT_SECRET: z.string().optional(),
  NEXT_PUBLIC_API_URL: z.string().default('http://localhost:8080'),
  NEXT_PUBLIC_URL: z.string().default('http://localhost:3000'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(): EnvConfig {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((issue) => issue.path.join('.')).join(', ');
      console.error(`❌ Invalid environment variables: ${missingVars}`);
      process.exit(1);
    }
    throw error;
  }
}

export const env = validateEnv();