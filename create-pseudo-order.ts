import { prisma } from './src/db';

async function main() {
  try {
    const phlebotomistEmail = 'phlebotomist1@bloodpanda.com';
    const phlebotomist = await prisma.user.findUnique({
      where: { email: phlebotomistEmail }
    });

    if (!phlebotomist) {
      console.error(`Phlebotomist with email ${phlebotomistEmail} not found!`);
      return;
    }

    console.log(`Found phlebotomist: ${phlebotomist.name} (${phlebotomist.id})`);

    // Find a regular user to be the customer, or just use any user
    const customer = await prisma.user.findFirst({
      where: { role: 'USER' }
    });

    if (!customer) {
        console.error('No regular user found to attach to the booking.');
        return;
    }

    // Set today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create a new booking
    const booking = await prisma.booking.create({
      data: {
        user: { connect: { id: customer.id } },
        phlebotomist: { connect: { id: phlebotomist.id } },
        status: 'CONFIRMED',
        paymentStatus: 'PENDING',
        schedules: {
          create: {
            scheduleDate: today,
            slot: '8:00 PM - 10:00 PM' // 8:00 PM starts at 20:00, ends at 22:00. Now is 20:20.
          }
        }
      },
      include: {
        schedules: true
      }
    });

    console.log('Successfully created pseudo order:');
    console.log(JSON.stringify(booking, null, 2));

  } catch (error) {
    console.error('Error creating pseudo order:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
