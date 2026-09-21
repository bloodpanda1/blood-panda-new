import { prisma } from '../src/db'

async function registerUser(email: string, name: string, role: string) {
  try {
    const res = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': 'http://localhost:3000', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password: 'password123', name })
    });
    console.log(`Signup ${email}:`, res.status);
    // Ignore 400s if already registered, just update role below
  } catch (e) {
    console.error(`Error registering ${email}`, e);
  }
  await prisma.user.updateMany({
    where: { email },
    data: { role: role as any, emailVerified: true }
  });
}

async function main() {
  console.log('Seeding admins...')
  
  await registerUser('superadmin@bloodpanda.com', 'Super Admin', 'SUPER_ADMIN')
  await registerUser('coo@bloodpanda.com', 'Chief Operating Officer', 'COO')
  await registerUser('phlebotomist1@bloodpanda.com', 'John Phlebotomist', 'PHLEBOTOMIST')

  console.log('✅ Seeding complete. All passwords are "password123"')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
