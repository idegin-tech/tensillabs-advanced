export interface SeedConfig {
  environment: 'development' | 'production' | 'test';
  runSeeds: string[];
  globalSeeds: string[];
}

export const seedConfig: Record<string, SeedConfig> = {
  development: {
    environment: 'development',
    runSeeds: ['dev-users'],
    globalSeeds: ['global-settings']
  },
  production: {
    environment: 'production',
    runSeeds: [],
    globalSeeds: ['global-settings']
  },
  test: {
    environment: 'test',
    runSeeds: ['dev-users'],
    globalSeeds: ['global-settings']
  }
};

export function getSeedConfig(): SeedConfig {
  const env = process.env.NODE_ENV || 'development';
  return seedConfig[env] || seedConfig.development;
}