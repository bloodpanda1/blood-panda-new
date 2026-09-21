
import { prisma } from "./src/db.js";

async function main() {
  console.log("Deleting all Bookings...");
  const b = await prisma.booking.deleteMany();
  console.log(`Deleted ${b.count} bookings.`);
  
  console.log("Deleting all Patients (Members)...");
  const m = await prisma.member.deleteMany();
  console.log(`Deleted ${m.count} members.`);
  
  console.log("Deleting all test Users (role = USER)...");
  const u = await prisma.user.deleteMany({
    where: {
      role: "USER"
    }
  });
  console.log(`Deleted ${u.count} users.`);

  console.log("Database cleared of test data!");
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());

