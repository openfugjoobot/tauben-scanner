#!/usr/bin/env node
/**
 * Reset DB mit 6 Tauben - Bilder als Base64
 */

const API_URL = 'https://tauben-scanner.fugjoo.duckdns.org/api';
const IMAGE_DIR = './mobile/assets/test-pigeons';

const fs = require('fs');
const path = require('path');

const pigeonsData = [
  {
    file: 'pigeon_01.jpg',
    name: 'Molly',
    description: 'Eine freundliche Stadttaube mit grauem Gefieder und irisierendem Hals. Oft am Brunnen zu sehen.',
    color: 'Grau mit grün-lila Schimmer',
    location: { lat: 46.3169, lng: 11.2744, name: 'Neumarkt Hauptplatz' }
  },
  {
    file: 'pigeon_02.jpg',
    name: 'Fritz',
    description: 'Aktiver Plätzer mit markanten weißen Flügelbändern. Wird oft beim Sonnenbaden beobachtet.',
    color: 'Dunkelgrau mit weißen Akzenten',
    location: { lat: 46.3172, lng: 11.2751, name: 'Rathaus Neumarkt' }
  },
  {
    file: 'pigeon_03.jpg',
    name: 'Lotti',
    description: 'Neugierige Taube die keine Scheu vor Menschen hat. Kommt oft auf Café-Tische.',
    color: 'Hellgrau mit braunen Federn',
    location: { lat: 46.3165, lng: 11.2738, name: 'Marktplatz Egna' }
  },
  {
    file: 'pigeon_04.jpg',
    name: 'Günther',
    description: 'Der älteste und erfahrenste Vertreter der Tauben-Community. Kennt jeden Winkel des Parks.',
    color: 'Silbergrau mit schwarzen Streifen',
    location: { lat: 46.3159, lng: 11.2762, name: 'Promenade Neumarkt' }
  },
  {
    file: 'pigeon_05.jpg',
    name: 'Susi',
    description: 'Schnelle Fliegerin und Gewinnerin beim täglichen Futter-Wettlauf. Elegant und wachsam.',
    color: 'Blaugrau mit weißer Schwanzspitze',
    location: { lat: 46.3178, lng: 11.2733, name: 'Bahnhof Neumarkt' }
  },
  {
    file: 'pigeon_06.jpg',
    name: 'Karl',
    description: 'Ruhepol der Gruppe. Bevorzugt sonnige Plätze auf warmen Steinbänken zum Nickerchen.',
    color: 'Graubraun mit grünem Hals',
    location: { lat: 46.3181, lng: 11.2771, name: 'Kirchplatz Neumarkt' }
  }
];

function fileToBase64(filePath) {
  const data = fs.readFileSync(filePath);
  const base64 = data.toString('base64');
  // JPEG detection
  return `data:image/jpeg;base64,${base64}`;
}

async function createPigeon(data) {
  const imagePath = path.join(IMAGE_DIR, data.file);
  
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Bild nicht gefunden: ${imagePath}`);
  }
  
  console.log(`🐦 Erstelle: ${data.name}...`);
  
  // Read image as base64
  const photoBase64 = fileToBase64(imagePath);
  console.log(`   📸 Bild geladen (${Math.round(photoBase64.length / 1024)} KB)`);
  
  const response = await fetch(`${API_URL}/pigeons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      location: data.location,
      is_public: true,
      photo: photoBase64,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }
  
  const result = await response.json();
  console.log(`   ✅ Erstellt: ${result.id.slice(0, 8)}...`);
  console.log(`   🧠 Embedding: ${result.embedding_generated ? 'generiert' : 'fehlgeschlagen'}`);
  
  return result;
}

async function main() {
  console.log('🚀 Erstelle 6 Tauben mit Bildern\n');
  
  try {
    for (const data of pigeonsData) {
      await createPigeon(data);
      console.log('');
    }
    
    // Verify
    const response = await fetch(`${API_URL}/pigeons`);
    const final = await response.json();
    console.log(`✅ Fertig! ${final.pigeons.length} Tauben in DB`);
    
    console.log('\n📊 Übersicht:');
    final.pigeons.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name} (${p.id.slice(0, 8)}...)`);
    });
    
  } catch (error) {
    console.error('\n❌ Fehler:', error.message);
    process.exit(1);
  }
}

main();
