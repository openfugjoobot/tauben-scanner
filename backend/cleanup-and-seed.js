const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function cleanup() {
  console.log('🗑️  Lösche alle Tauben...');
  await pool.query('DELETE FROM sightings');
  await pool.query('DELETE FROM images');
  await pool.query('DELETE FROM pigeons');
  console.log('✅ Alle Tauben gelöscht');
  await pool.end();
}

cleanup().catch(console.error).finally(() => process.exit(0));
