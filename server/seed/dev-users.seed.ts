import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../helpers/auth.helper';

export async function seedDevUsers(prisma: PrismaClient) {
  console.log('👤 Seeding development users...');

  // Check if dev user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: 'dev@tensillabs.com' }
  });

  if (existingUser) {
    console.log('👤 Dev user already exists, skipping...');
    return existingUser;
  }

  // Create development user with hashed password
  const hashedPassword = await hashPassword('password123');
  
  const devUser = await prisma.user.create({
    data: {
      email: 'dev@tensillabs.com',
      firstName: 'Dev',
      lastName: 'User',
      emailVerified: new Date(),
      userSecret: {
        create: {
          hashedPassword,
        }
      },
      workspaces: {
        create: {
          name: 'My Development Workspace',
          slug: 'dev-workspace',
        }
      }
    },
    include: {
      userSecret: true,
      workspaces: true,
    }
  });

  console.log(`✅ Created dev user: email(${devUser.email}) pwd(password123)`);
  console.log(`✅ Created workspace: ${devUser.workspaces[0].name} (${devUser.workspaces[0].slug})`);

  return devUser;
}