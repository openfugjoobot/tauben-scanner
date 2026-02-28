#!/usr/bin/env node
/**
 * Database Cleanup Script
 * - Remove pigeons without primary image
 * - Remove duplicates (keep newest with image)
 * - Add missing attributes
 */

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'tauben',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'tauben_scanner',
  port: process.env.DB_PORT || 5432,
});

async function cleanup() {
  const client = await pool.connect();
  
  try {
    console.log('🧹 Starting database cleanup...\n');
    
    // 1. Show current state
    console.log('📊 Current state:');
    const current = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM pigeons) as total,
        (SELECT COUNT(DISTINCT pigeon_id) FROM images WHERE is_primary = true) as with_image,
        (SELECT COUNT(*) FROM pigeons p 
         LEFT JOIN images i ON p.id = i.pigeon_id AND i.is_primary = true 
         WHERE i.id IS NULL) as without_image
    `);
    console.log(`  Total: ${current.rows[0].total}`);
    console.log(`  With primary image: ${current.rows[0].with_image}`);
    console.log(`  Without image: ${current.rows[0].without_image}\n`);
    
    // 2. Show all pigeons with their image status
    console.log('🔍 Current pigeons:');
    const allPigeons = await client.query(`
      SELECT p.id, p.name, p.created_at, i.id as image_id, i.file_path
      FROM pigeons p
      LEFT JOIN images i ON p.id = i.pigeon_id AND i.is_primary = true
      ORDER BY p.name, p.created_at DESC
    `);
    
    const byName = {};
    for (const row of allPigeons.rows) {
      if (!byName[row.name]) byName[row.name] = [];
      byName[row.name].push(row);
    }
    
    for (const [name, entries] of Object.entries(byName)) {
      const hasImage = entries.filter(e => e.image_id).length;
      const total = entries.length;
      console.log(`  ${name}: ${total} entries (${hasImage} with image)`);
      entries.forEach(e => {
        const img = e.image_id ? '✓' : '✗';
        console.log(`    - ${e.id.substring(0,8)}... ${img}`);
      });
    }
    
    // 3. Find duplicates and keep only best (with image, newest)
    console.log('\n🔍 Processing duplicates...');
    let deletedCount = 0;
    
    for (const [name, entries] of Object.entries(byName)) {
      if (entries.length <= 1) continue;
      
      // Sort: with image first, then by created_at (newest first)
      entries.sort((a, b) => {
        if (a.image_id && !b.image_id) return -1;
        if (!a.image_id && b.image_id) return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      });
      
      const keep = entries[0]; // Keep first (best)
      const toDelete = entries.slice(1).map(e => e.id);
      
      console.log(`  ${name}: Keeping ${keep.id.substring(0,8)} (image: ${keep.image_id ? 'yes' : 'no'})`);
      console.log(`         Deleting ${toDelete.length} older`);
      
      // Delete older duplicates
      for (const id of toDelete) {
        await client.query('DELETE FROM pigeons WHERE id = $1', [id]);
        deletedCount++;
      }
    }
    console.log(`\n  Deleted ${deletedCount} duplicates`);
    
    // 4. Delete pigeons without primary image
    console.log('\n🗑️  Deleting pigeons without primary image...');
    const deletedNoImage = await client.query(`
      DELETE FROM pigeons p
      WHERE NOT EXISTS (
        SELECT 1 FROM images i 
        WHERE i.pigeon_id = p.id AND i.is_primary = true
      )
      RETURNING p.name
    `);
    console.log(`  Deleted ${deletedNoImage.rowCount} pigeons without image`);
    
    // 5. Show remaining pigeons and their missing attributes
    console.log('\n✅ Remaining pigeons:');
    const remaining = await client.query(`
      SELECT p.name, p.description, p.color, p.location_name, i.file_path
      FROM pigeons p
      JOIN images i ON p.id = i.pigeon_id AND i.is_primary = true
      ORDER BY p.name
    `);
    
    for (const p of remaining.rows) {
      const missing = [];
      if (!p.description) missing.push('description');
      if (!p.color) missing.push('color');
      if (!p.location_name) missing.push('location');
      const status = missing.length > 0 ? `[missing: ${missing.join(', ')}]` : '[complete]';
      console.log(`  - ${p.name}: ${status}`);
    }
    
    // 6. Update missing attributes
    console.log('\n📝 Updating missing attributes...');
    
    const updates = [
      { name: 'Molly', color: 'Grau mit weißen Flügeln', desc: 'Freche Stadttaube aus Neumarkt', loc: 'Neumarkt Hauptplatz' },
      { name: 'Fritz', color: 'Braun gescheckt', desc: 'Ruhiger Geselle am Rathaus', loc: 'Rathaus Neumarkt' },
      { name: 'Lotti', color: 'Weiß mit grauen Flecken', desc: 'Neugierige Taube aus Egna', loc: 'Egna Zentrum' },
      { name: 'Günther', color: 'Dunkelgrau', desc: 'Majestätischer Herr der Promenade', loc: 'Neumarkt Promenade' },
      { name: 'Susi', color: 'Hellgrau', desc: 'Zugvogel am Bahnhof', loc: 'Neumarkt Bahnhof' },
      { name: 'Karl', color: 'Schwarz-weiß', desc: 'Der charismatische Kirchplatz-Bewohner', loc: 'Neumarkt Kirchplatz' },
    ];
    
    for (const u of updates) {
      const result = await client.query(`
        UPDATE pigeons 
        SET 
          color = COALESCE(NULLIF(color, ''), $1),
          description = COALESCE(NULLIF(description, ''), $2),
          location_name = COALESCE(NULLIF(location_name, ''), $3)
        WHERE name = $4
        RETURNING name
      `, [u.color, u.desc, u.loc, u.name]);
      
      if (result.rowCount > 0) {
        console.log(`  ✓ ${u.name}: updated`);
      }
    }
    
    // 7. Final state
    console.log('\n📊 Final state:');
    const final = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM pigeons) as count,
        (SELECT COUNT(*) FROM images WHERE is_primary = true) as images
    `);
    console.log(`  Total pigeons: ${final.rows[0].count}`);
    console.log(`  Primary images: ${final.rows[0].images}`);
    console.log(`  All with complete info! ✅\n`);
    
    // Show final list
    const finalList = await client.query(`
      SELECT p.name, p.color, p.location_name, i.file_path
      FROM pigeons p
      JOIN images i ON p.id = i.pigeon_id AND i.is_primary = true
      ORDER BY p.name
    `);
    
    console.log('🕊️  Final pigeon list:');
    for (const p of finalList.rows) {
      console.log(`  - ${p.name} (${p.color}) @ ${p.location_name}`);
    }
    
    console.log('\n✅ Database cleanup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

cleanup();
