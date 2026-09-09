import fs from 'fs';
import path from 'path';

const images = {
  'person_doctor_ashok.jpg': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=85',
  'location_village_home.jpg': 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=800&q=85',
  'location_riverbank.jpg': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=85',
  'location_tea_garden.jpg': 'https://images.unsplash.com/photo-1588665555327-a67c73b3cc23?auto=format&fit=crop&w=800&q=85',
  'clip_family_gathering.jpg': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=85',
  'clip_folk_dance.jpg': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=85',
  'festival_diwali.jpg': 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=85',
  'festival_holi.jpg': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=85',
  'festival_durga_puja.jpg': 'https://images.unsplash.com/photo-1571216332002-282dce467b32?auto=format&fit=crop&w=800&q=85',
  'festival_bihu.jpg': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=85',
  'festival_lohri.jpg': 'https://images.unsplash.com/photo-1543083477-4f785aeafaa9?auto=format&fit=crop&w=800&q=85',
  'food_traditional_thali.jpg': 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=800&q=85',
  'food_chai_samosa.jpg': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=85',
  'food_sweets_mithai.jpg': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=85',
  'food_pitha.jpg': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=85',
  'food_sarson_saag.jpg': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=85',
  'culture_morning_puja.jpg': 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=800&q=85',
  'culture_music_harmonium.jpg': 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=85',
  'culture_handloom_saree.jpg': 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=85',
  'memory_vintage_album.jpg': 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=85',
  'memory_brass_box.jpg': 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=800&q=85'
};

const targetDir = path.resolve('public/images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function run() {
  console.log('Downloading Indian imagery for MindNest...');
  for (const [filename, url] of Object.entries(images)) {
    const filePath = path.join(targetDir, filename);
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
      console.log(`Already exists: ${filename}`);
      continue;
    }
    try {
      console.log(`Downloading ${filename}...`);
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
      console.log(`Saved: ${filename} (${arrayBuffer.byteLength} bytes)`);
    } catch (e) {
      console.error(`Failed ${filename}: ${e.message}`);
    }
  }
  console.log('Finished downloading imagery!');
}

run();
