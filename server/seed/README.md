# Database Seeding System

This directory contains the database seeding system for TensilLabs Advanced.

## Structure

```
server/seed/
├── index.ts              # Main seed runner
├── seed.config.ts        # Environment-based seed configuration
├── seed.types.ts         # TypeScript types for seeds
├── dev-users.seed.ts     # Development user seed
└── README.md            # This file
```

## How it Works

The seeding system is environment-aware and modular:

1. **Environment Configuration**: `seed.config.ts` defines which seeds run in each environment
2. **Seed Registry**: `index.ts` maintains a registry of available seeds
3. **Modular Seeds**: Each seed is a separate file with a specific purpose

## Available Seeds

### `dev-users`
Creates a development user with:
- Email: `dev@tensillabs.com`
- Password: `password123`
- Verified email
- Default workspace: "My Development Workspace"
- UserSecret with hashed password

## Usage

### Run all seeds for current environment
```bash
npm run db:seed
```

### Run development seeds specifically
```bash
npm run db:seed:dev
```

### Complete development setup (generate + push + seed)
```bash
npm run dev:setup
```

## Adding New Seeds

1. Create a new seed file (e.g., `my-feature.seed.ts`):

```typescript
import { PrismaClient } from '@prisma/client';

export async function seedMyFeature(prisma: PrismaClient) {
  console.log('🔄 Seeding my feature...');
  
  // Your seed logic here
  
  console.log('✅ My feature seeded');
}
```

2. Register it in `index.ts`:

```typescript
const seedRegistry: Record<string, SeedModule> = {
  'my-feature': {
    name: 'my-feature',
    description: 'Seeds my awesome feature',
    seedFunction: seedMyFeature
  }
};
```

3. Add it to the appropriate environment in `seed.config.ts`:

```typescript
development: {
  environment: 'development',
  runSeeds: ['dev-users', 'my-feature']
}
```

## Environment Safety

- **Production**: Seeding is completely disabled
- **Development**: All development seeds run
- **Test**: Only essential seeds for testing run

This prevents accidental data creation in production environments.