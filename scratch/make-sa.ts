import { prisma } from '../src/db';
async function main() {
  await prisma.user.deleteMany({ where: { email: 'superadmin@bloodpanda.com' } });
  const res = await fetch('http://localhost:3000/api/auth/sign-up/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:3000',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email: 'superadmin@bloodpanda.com', password: 'password123', name: 'Super Admin' })
  });
  console.log(res.status, await res.text());
  await prisma.user.updateMany({
    where: { email: 'superadmin@bloodpanda.com' },
    data: { role: 'SUPER_ADMIN' as any, emailVerified: true }
  });
  console.log('Done superadmin@bloodpanda.com');
}
main();
