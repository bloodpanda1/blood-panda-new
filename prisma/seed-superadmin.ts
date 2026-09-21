// Force database URL to PROD
process.env.DATABASE_URL = "postgresql://neondb_owner:npg_diZAUa9XBGH6@ep-empty-mode-aogwj6x7-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require";

import { auth } from "../src/lib/auth.js";
import { prisma } from "../src/db.js";

async function main() {
  const email = process.env.SUPERADMIN_EMAIL;
  const password = process.env.SUPERADMIN_PASS;

  if (!email || !password) {
    throw new Error("Missing SUPERADMIN_EMAIL or SUPERADMIN_PASS in environment");
  }

  console.log(`Seeding super admin with email: ${email} to prod database...`);

  // Delete existing user so we can seed with the EXACT password from .env
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("User already exists, deleting to recreate with env password...");
    await prisma.user.delete({ where: { email } });
  }

  // Use better-auth to create user so password is correct and hashed properly
  console.log("Creating new superadmin via better-auth...");
  try {
    const headers = new Headers();
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: "Super Admin",
      },
      headers: headers
    });
    
    if (result && result.user) {
      // Update role to SUPER_ADMIN because the hook forces USER
      await prisma.user.update({
        where: { id: result.user.id },
        data: { role: 'SUPER_ADMIN', emailVerified: true }
      });
      console.log("Super Admin successfully created and seeded with env password.");
    } else {
      console.error("Failed to create user:", result);
    }
  } catch(e) {
    console.error("Error creating superadmin:", e);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
