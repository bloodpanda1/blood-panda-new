import { prisma } from '../src/db'

async function main() {
  const phleb = await prisma.user.findUnique({ where: { email: 'phlebotomist1@bloodpanda.com' } });
  if (!phleb) {
    console.log('Phlebotomist not found');
    return;
  }
  
  const phlebAcc = await prisma.account.findFirst({ where: { userId: phleb.id } });
  if (!phlebAcc || !phlebAcc.password) {
    console.log('No password hash found for phleb');
    return;
  }
  
  const hash = phlebAcc.password;
  console.log('Found proper password hash for password123');
  
  await prisma.user.deleteMany({ where: { email: 'superadmin@bloodpanda.com' } });
  
  const u = await prisma.user.create({
    data: {
      email: 'superadmin@bloodpanda.com',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      emailVerified: true
    }
  });
  
  await prisma.account.create({
    data: {
      userId: u.id,
      accountId: 'email',
      providerId: 'email',
      password: hash,
    }
  });
  
  console.log('SUCCESSFULLY RE-CREATED SUPERADMIN WITH CORRECT HASH FOR password123');
}

main().finally(() => prisma.$disconnect());
