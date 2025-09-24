import { PrismaClient } from '@prisma/client';
import { seedDevUsers } from './dev-users.seed.js';
import { seedGlobalSettings } from './global-settings.seed.js';
import { getSeedConfig } from './seed.config.js';
import { SeedModule } from './seed.types.js';

const prisma = new PrismaClient();

// Registry of available seeds
const seedRegistry: Record<string, SeedModule> = {
  'dev-users': {
    name: 'dev-users',
    description: 'Creates development user with workspace and secrets',
    seedFunction: seedDevUsers
  },
  'global-settings': {
    name: 'global-settings',
    description: 'Seeds global application settings',
    seedFunction: seedGlobalSettings
  }
};

async function main() {
  const config = getSeedConfig();
  
  console.log(`🌱 Starting database seeding for ${config.environment} environment...`);

  try {
    // Run global seeds that execute regardless of environment
    if (config.globalSeeds.length > 0) {
      console.log('🌍 Running global seeds...');
      for (const seedName of config.globalSeeds) {
        const seed = seedRegistry[seedName];
        
        if (!seed) {
          console.warn(`⚠️  Global seed '${seedName}' not found in registry`);
          continue;
        }

        console.log(`🔄 Running global seed: ${seed.name} - ${seed.description}`);
        await seed.seedFunction(prisma);
      }
    }

    // Run environment-specific seeds
    if (config.environment === 'production' && config.runSeeds.length === 0) {
      console.log('🚫 No environment-specific seeds configured for production');
    } else if (config.runSeeds.length > 0) {
      console.log(`📦 Running environment-specific seeds for ${config.environment}...`);
      for (const seedName of config.runSeeds) {
        const seed = seedRegistry[seedName];
        
        if (!seed) {
          console.warn(`⚠️  Seed '${seedName}' not found in registry`);
          continue;
        }

        console.log(`🔄 Running seed: ${seed.name} - ${seed.description}`);
        await seed.seedFunction(prisma);
      }
    }
    
    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });