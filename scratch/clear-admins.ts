import { prisma } from '../src/db'

async function main() {
  console.log('Fetching existing password hash...');
  
  // Try to find a user to copy hash from, or just get any account since we know one of them has password123 right now
  let hashToUse = '';
  const phleb = await prisma.user.findUnique({ where: { email: 'phlebotomist1@bloodpanda.com' } });
  if (phleb) {
    const phlebAcc = await prisma.account.findFirst({ where: { userId: phleb.id } });
    if (phlebAcc?.password) {
      hashToUse = phlebAcc.password;
    }
  }
  
  // If we couldn't find phlebotomist, let's grab the current superadmin's hash since we literally just set it to password123
  if (!hashToUse) {
    const sa = await prisma.user.findUnique({ where: { email: 'superadmin@bloodpanda.com' } });
    if (sa) {
      const saAcc = await prisma.account.findFirst({ where: { userId: sa.id } });
      if (saAcc?.password) {
        hashToUse = saAcc.password;
      }
    }
  }
  
  if (!hashToUse) {
    console.error('Could not find a valid password123 hash to copy! Aborting.');
    return;
  }
  
  console.log('Clearing all admins...');
  await prisma.user.deleteMany({
    where: {
      OR: [
        { role: 'SUPER_ADMIN' as any },
        { role: 'COO' as any },
        { role: 'PHLEBOTOMIST' as any }
      ]
    }
  });
  
  console.log('Creating superadmin@example.com...');
  const u = await prisma.user.create({
    data: {
      email: 'superadmin@example.com',
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
      password: hashToUse,
    }
  });
  
  console.log('SUCCESS! Admin cleared. Added superadmin@example.com with password: password123');
}

main().finally(() => prisma.$disconnect());
