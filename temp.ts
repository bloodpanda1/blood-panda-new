
import { prisma } from "./src/db.js";
async function main() {
  await prisma.user.deleteMany({ where: { email: "superadmin@bloodpanda.com" } });
  console.log("Deleted old local superadmin");
}
main().finally(() => prisma.$disconnect());

