import { PrismaClient } from '@prisma/client';

export type SeedFunction = (prisma: PrismaClient) => Promise<any>;

export interface SeedModule {
  name: string;
  description: string;
  seedFunction: SeedFunction;
}

export const createSeedModule = (
  name: string, 
  description: string, 
  seedFunction: SeedFunction
): SeedModule => ({
  name,
  description,
  seedFunction
});