import { prisma } from '../src/db.js'

async function main() {
  const email = 'krajeevrao@gmail.com'
  console.log(`Looking for user with email: ${email}`)
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      bookings: true,
      patientProfiles: true,
      members: true,
    }
  })

  if (!user) {
    console.log('User not found.')
    return
  }

  console.log(`Found user: ${user.id}`)

  try {
    // Delete the user
    await prisma.user.delete({
      where: { id: user.id }
    })
    console.log('User deleted successfully.')
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
