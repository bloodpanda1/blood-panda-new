import { prisma } from '../src/db'

async function main() {
  console.log('Finding John Doe users...')
  const users = await prisma.user.findMany({
    where: {
      name: {
        startsWith: 'John Doe',
      },
    },
  })

  console.log(`Found ${users.length} John Doe users to delete.`)

  for (const user of users) {
    console.log(`Deleting user: ${user.name} (${user.id})`)
    
    // Check if the user has a patient profile first
    const memberRecords = await prisma.member.findMany({
        where: { userId: user.id }
    })
    
    for (const member of memberRecords) {
        await prisma.testItem.deleteMany({
            where: { memberId: member.id }
        })
    }

    // Delete associated members first if not cascade
    await prisma.member.deleteMany({
      where: {
        userId: user.id,
      },
    })
    
    // Delete associated addresses
    await prisma.address.deleteMany({
      where: {
        userId: user.id,
      },
    })

    // Delete associated bookings
    await prisma.booking.deleteMany({
      where: {
        userId: user.id,
      },
    })

    // Delete associated sessions/accounts if any
    await prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    })
    await prisma.account.deleteMany({
      where: {
        userId: user.id,
      },
    })

    // Delete the user
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  }
  
  console.log('Finished deleting John Doe users.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
