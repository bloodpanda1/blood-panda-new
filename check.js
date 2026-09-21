import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_diZAUa9XBGH6@ep-empty-mode-aogwj6x7-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require');

sql`SELECT email, role FROM "user" WHERE email = 'krajeevrao@gmail.com'`.then(res => {
  console.log(res);
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
