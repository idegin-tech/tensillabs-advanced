export interface SeedConfig {
  environment: 'development' | 'production' | 'test';
  runSeeds: string[];
}

export const seedConfig: Record<string, SeedConfig> = {
  development: {
    environment: 'development',
    runSeeds: ['dev-users']
  },
  production: {
    environment: 'production',
    runSeeds: [] // No seeds in production
  },
  test: {
    environment: 'test',
    runSeeds: ['dev-users']
  }
};

export function getSeedConfig(): SeedConfig {
  const env = process.env.NODE_ENV || 'development';
  return seedConfig[env] || seedConfig.development;
}