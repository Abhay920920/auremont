const fs = require('fs');
const path = require('path');

const dirs = [
  'c:/Users/adts-/Desktop/almonds/auremont-frontend/app',
  'c:/Users/adts-/Desktop/almonds/auremont-frontend/components'
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      if (content.includes('py-super')) { content = content.replace(/\bpy-super\b/g, 'py-24 md:py-super'); changed = true; }
      if (content.includes('pb-super')) { content = content.replace(/\bpb-super\b/g, 'pb-24 md:pb-super'); changed = true; }
      if (content.includes('pt-super')) { content = content.replace(/\bpt-super\b/g, 'pt-24 md:pt-super'); changed = true; }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

dirs.forEach(processDir);
