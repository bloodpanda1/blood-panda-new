import { prisma } from '../src/db'

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'phlebotomist@bloodpanda.com' },
    include: { accounts: true }
  });
  console.dir(user, { depth: null });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
