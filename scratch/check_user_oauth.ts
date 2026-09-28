import { prisma } from '../src/db.js'

async function main() {
  const email = 'bloodpandamarketing@gmail.com'
  console.log(`Looking for user with email: ${email}`)

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    console.log('User NOT found in prod DB')
    return
  }

  console.log('User found:')
  console.log('  id:', user.id)
  console.log('  name:', user.name)
  console.log('  emailVerified:', user.emailVerified)
  console.log('  createdAt:', user.createdAt)

  const accounts = await prisma.account.findMany({ where: { userId: user.id } })
  if (!accounts.length) {
    console.log('\nNo linked OAuth accounts → likely email/password signup')
  } else {
    console.log('\nLinked OAuth accounts:')
    accounts.forEach(a => console.log(`  provider: ${a.providerId} | accountId: ${a.accountId}`))
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
