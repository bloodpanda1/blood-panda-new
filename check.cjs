const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_diZAUa9XBGH6@ep-empty-mode-aogwj6x7-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require'
});

client.connect().then(() => {
  return client.query("SELECT email, role FROM \"user\" WHERE email = 'krajeevrao@gmail.com'");
}).then(res => {
  console.log(res.rows);
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
