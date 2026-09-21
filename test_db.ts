
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  const members = await prisma.member.findMany();
  const bookings = await prisma.booking.findMany();
  const admins = users.filter(u => u.role === "SUPER_ADMIN" || u.role === "COO");
  console.log("Users:", users.length, "Admins:", admins.length, "Members:", members.length, "Bookings:", bookings.length);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());

