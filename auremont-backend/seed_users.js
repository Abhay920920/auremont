const { PrismaClient } = require('@prisma/client');
/* eslint-disable */
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

/**
 * Main seed execution for users
 */
async function main() {
  try {
    const adminPassword = await bcrypt.hash('Admin@12345', 10);
    const testPassword = await bcrypt.hash('password123', 10);

    await prisma.user.upsert({
      where: { email: 'admin@auremont.com' },
      update: {
        passwordHash: adminPassword,
        role: 'admin',
      },
      create: {
        firstName: 'Auremont',
        lastName: 'Concierge',
        email: 'admin@auremont.com',
        passwordHash: adminPassword,
        role: 'admin',
        emailVerified: true,
      },
    });

    await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {
        passwordHash: testPassword,
        role: 'admin',
      },
      create: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        passwordHash: testPassword,
        role: 'admin',
        emailVerified: true,
      },
    });

    await prisma.user.upsert({
      where: { email: 'example@gmail.com' },
      update: {
        passwordHash: testPassword,
        role: 'customer',
      },
      create: {
        firstName: 'Test',
        lastName: 'Customer',
        email: 'example@gmail.com',
        passwordHash: testPassword,
        role: 'customer',
        emailVerified: true,
      },
    });

    console.log('SEED_USERS_SUCCESS: Accounts upserted successfully!');
  } catch (err) {
    console.error('SEED_USERS_ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
