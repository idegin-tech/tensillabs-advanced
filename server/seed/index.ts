import { PrismaClient } from '@prisma/client';
import { seedDevUsers } from './dev-users.seed.js';
import { getSeedConfig } from './seed.config.js';
import { SeedModule } from './seed.types.js';

const prisma = new PrismaClient();

// Registry of available seeds
const seedRegistry: Record<string, SeedModule> = {
  'dev-users': {
    name: 'dev-users',
    description: 'Creates development user with workspace and secrets',
    seedFunction: seedDevUsers
  }
};

async function main() {
  const config = getSeedConfig();
  
  if (config.environment === 'production') {
    console.log('🚫 Seeding is disabled in production');
    return;
  }

  console.log(`🌱 Starting database seeding for ${config.environment} environment...`);

  try {
    for (const seedName of config.runSeeds) {
      const seed = seedRegistry[seedName];
      
      if (!seed) {
        console.warn(`⚠️  Seed '${seedName}' not found in registry`);
        continue;
      }

      console.log(`🔄 Running seed: ${seed.name} - ${seed.description}`);
      await seed.seedFunction(prisma);
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