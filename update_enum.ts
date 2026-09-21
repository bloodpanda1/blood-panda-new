import { Client } from '@neondatabase/serverless';

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  await client.query(`ALTER TABLE "member" ALTER COLUMN "sampleStatus" DROP DEFAULT;`);
  await client.query(`ALTER TABLE "member" ALTER COLUMN "sampleStatus" TYPE VARCHAR(255) USING "sampleStatus"::text;`);
  
  await client.query(`UPDATE "member" SET "sampleStatus" = 'BOOKED' WHERE "sampleStatus" = 'PENDING';`);
  await client.query(`UPDATE "member" SET "sampleStatus" = 'REPORT_RELEASED' WHERE "sampleStatus" = 'REPORT_READY';`);
  
  await client.end();
  console.log("Updated values!");
}

run().catch(console.error);
