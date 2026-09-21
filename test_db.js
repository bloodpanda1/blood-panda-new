
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  const members = await prisma.member.findMany();
  const bookings = await prisma.booking.findMany();
  console.log("Users:", users.length, "Members:", members.length, "Bookings:", bookings.length);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());

