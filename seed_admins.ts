
import { prisma } from "./src/db.js";

async function main() {
  console.log("Creating admins...");
  
  try {
    await prisma.user.create({
      data: {
        name: "Super Admin",
        email: "superadmin@bloodpanda.com",
        role: "SUPER_ADMIN",
        emailVerified: true
      }
    });
    console.log("Super Admin created.");
  } catch(e) { console.log(e.message) }

  try {
    await prisma.user.create({
      data: {
        name: "Chief Operating Officer",
        email: "coo@bloodpanda.com",
        role: "COO",
        emailVerified: true
      }
    });
    console.log("COO created.");
  } catch(e) { console.log(e.message) }
  
  try {
    await prisma.user.create({
      data: {
        name: "Phlebotomist",
        email: "phlebotomist@bloodpanda.com",
        role: "PHLEBOTOMIST",
        emailVerified: true
      }
    });
    console.log("Phlebotomist created.");
  } catch(e) { console.log(e.message) }

  console.log("Admins seeded.");
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());

