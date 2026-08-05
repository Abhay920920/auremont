const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\adts-\\.gemini\\antigravity-ide\\brain\\0d1ad50a-1e4e-4ba2-9498-2e661185efa8';
const destDir = 'C:\\Users\\adts-\\Desktop\\almonds\\auremont-frontend\\public\\images';

const files = fs.readdirSync(srcDir);
const images = [
  { prefix: 'our_story_orchard_', name: 'our_story_orchard.png' },
  { prefix: 'our_story_craftsmanship_', name: 'our_story_craftsmanship.png' },
  { prefix: 'our_story_sustainability_', name: 'our_story_sustainability.png' }
];

for (const img of images) {
  const match = files.find(f => f.startsWith(img.prefix) && f.endsWith('.png'));
  if (match) {
    fs.copyFileSync(path.join(srcDir, match), path.join(destDir, img.name));
    console.log('Copied', match, 'to', img.name);
  }
}
