import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@rarenuts.com';
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error('ADMIN_PASSWORD environment variable is required to create an admin.');
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hashedPassword,
      role: 'admin',
    },
    create: {
      firstName: 'RARE NUTS',
      lastName: 'Admin',
      email,
      phone: '+1234567890',
      passwordHash: hashedPassword,
      role: 'admin',
    },
  });

  console.log('Admin user created successfully.');
  console.log('Username (Email):', admin.email);
  console.log('Password:', '[REDACTED_PASSWORD]');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(console.error);
