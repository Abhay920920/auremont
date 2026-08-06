import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Deleting all users except admin@auremont.com...');
  const result = await prisma.user.deleteMany({
    where: {
      email: {
        not: 'admin@auremont.com'
      }
    }
  });
  console.log(`Deleted ${result.count} users.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(console.error);
