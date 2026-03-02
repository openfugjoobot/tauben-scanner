import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import { extractEmbeddingFromBase64 } from '../services/embedding';

// Load environment variables
config({ path: join(__dirname, '../../.env') });

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Seed data - 6 real test pigeons with South Tyrol coordinates
const SEED_PIGEONS = [
  {
    name: 'Heidi',
    description: 'Rote Fußringe, sehr zutraulich, hängt oft am Hauptbahnhof',
    location: { lat: 46.4983, lng: 11.3547, name: 'Bozen Hauptbahnhof' },
    imageFile: 'pigeon_01.jpg',
  },
  {
    name: 'Franz',
    description: 'Graue Federn mit weißem Streifen, ängstlich, lebt im Park',
    location: { lat: 46.4989, lng: 11.3498, name: 'Waltherplatz Bozen' },
    imageFile: 'pigeon_02.jpg',
  },
  {
    name: 'Greta',
    description: 'Schwarz-weiß gescheckt, frisst aus der Hand, bekannt im Einkaufszentrum',
    location: { lat: 46.4975, lng: 11.3562, name: 'Europark Bozen' },
    imageFile: 'pigeon_03.jpg',
  },
  {
    name: 'Otto',
    description: 'Große braune Taube mit grünem Hals, sehr dominant',
    location: { lat: 46.5002, lng: 11.3510, name: 'Talferwiesen Bozen' },
    imageFile: 'pigeon_04.jpg',
  },
  {
    name: 'Leni',
    description: 'Kleine weiße Taube, oft mit anderen Jungtieren unterwegs',
    location: { lat: 46.4968, lng: 11.3535, name: 'Universitätsplatz Bozen' },
    imageFile: 'pigeon_05.jpg',
  },
  {
    name: 'Max',
    description: 'Beringte Stadt-Taube, wird regelmäßig gesichtet im Stadtpark',
    location: { lat: 46.4995, lng: 11.3487, name: 'Palais-Sparkasse Park' },
    imageFile: 'pigeon_06.jpg',
  },
];

// Ensure uploads directory exists
const UPLOADS_DIR = process.env.UPLOADS_DIR || join(process.cwd(), 'uploads');

interface SeedResult {
  created: string[];
  skipped: string[];
  errors: string[];
}

/**
 * Convert image file to base64 data URL
 */
function imageToBase64DataUrl(imagePath: string): string {
  const buffer = readFileSync(imagePath);
  const base64 = buffer.toString('base64');
  return `data:image/jpeg;base64,${base64}`;
}

/**
 * Check if pigeon already exists
 */
async function pigeonExists(name: string): Promise<boolean> {
  const result = await pool.query('SELECT id FROM pigeons WHERE name = $1', [name]);
  return (result.rowCount ?? 0) > 0;
}

/**
 * Save base64 image to file
 */
function saveImageFile(base64Data: string, filename: string): { path: string; size: number } {
  const base64WithoutPrefix = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64WithoutPrefix, 'base64');
  const filePath = join(UPLOADS_DIR, filename);
  
  // Write file
  const fs = require('fs');
  fs.writeFileSync(filePath, buffer);
  
  return { path: filename, size: buffer.length };
}

/**
 * Insert a single pigeon into database
 */
async function insertPigeon(pigeon: typeof SEED_PIGEONS[0]): Promise<void> {
  // Read from source directory (works both in dev and compiled)
  const imagePath = join(__dirname, '..', '..', 'src', 'scripts', 'samples', pigeon.imageFile);
  
  console.log(`📝 Processing ${pigeon.name}...`);
  
  // Convert image to base64
  const photoBase64 = imageToBase64DataUrl(imagePath);
  console.log(`   📸 Image loaded (${Math.round(photoBase64.length / 1024)}KB)`);
  
  // Extract embedding
  console.log(`   🧠 Extracting embedding...`);
  const embedding = await extractEmbeddingFromBase64(photoBase64);
  console.log(`   ✅ Embedding: ${embedding.length} dimensions`);
  
  // Save image file
  const timestamp = Date.now();
  const filename = `${timestamp}_${pigeon.name.toLowerCase()}.jpg`;
  const imageData = saveImageFile(photoBase64, filename);
  console.log(`   💾 Image saved: ${filename}`);
  
  // Insert pigeon
  const pigeonQuery = `
    INSERT INTO pigeons (name, description, location_lat, location_lng, location_name, is_public, embedding, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7::vector, NOW())
    RETURNING id
  `;
  
  const result = await pool.query(pigeonQuery, [
    pigeon.name,
    pigeon.description,
    pigeon.location.lat,
    pigeon.location.lng,
    pigeon.location.name,
    true, // is_public
    `[${embedding.join(',')}]`,
  ]);
  
  const pigeonId = result.rows[0].id;
  
  // Insert image record
  const imageQuery = `
    INSERT INTO images (pigeon_id, file_path, file_size, mime_type, embedding, is_primary, created_at)
    VALUES ($1, $2, $3, $4, $5::vector, true, NOW())
  `;
  
  await pool.query(imageQuery, [
    pigeonId,
    imageData.path,
    imageData.size,
    'image/jpeg',
    `[${embedding.join(',')}]`,
  ]);
  
  console.log(`   ✅ Created: ${pigeon.name} in ${pigeon.location.name}\n`);
}

/**
 * Main seed function
 */
async function seedDatabase(): Promise<SeedResult> {
  console.log('🚀 Starting database seed...\n');
  
  const result: SeedResult = {
    created: [],
    skipped: [],
    errors: [],
  };
  
  for (const pigeon of SEED_PIGEONS) {
    try {
      // Check if already exists
      if (await pigeonExists(pigeon.name)) {
        console.log(`⏭️  Skipping ${pigeon.name} (already exists)\n`);
        result.skipped.push(pigeon.name);
        continue;
      }
      
      // Insert pigeon
      await insertPigeon(pigeon);
      result.created.push(pigeon.name);
      
    } catch (error) {
      console.error(`   ❌ Error creating ${pigeon.name}:`, error);
      result.errors.push(`${pigeon.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  return result;
}

/**
 * Main execution
 */
async function main() {
  try {
    // Test database connection
    console.log('🔌 Connecting to database...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected\n');
    
    // Run seed
    const result = await seedDatabase();
    
    // Summary
    console.log('\n📊 Seed Summary:');
    console.log('----------------');
    console.log(`✅ Created: ${result.created.length} pigeons`);
    if (result.created.length > 0) {
      console.log(`   ${result.created.join(', ')}`);
    }
    
    if (result.skipped.length > 0) {
      console.log(`⏭️  Skipped: ${result.skipped.length} pigeons (already exist)`);
      console.log(`   ${result.skipped.join(', ')}`);
    }
    
    if (result.errors.length > 0) {
      console.log(`❌ Errors: ${result.errors.length}`);
      for (const error of result.errors) {
        console.log(`   - ${error}`);
      }
      process.exit(1);
    }
    
    console.log('\n🎉 Seed completed successfully!');
    console.log('💡 Test with: curl http://localhost:3000/api/pigeons');
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { seedDatabase };
