const fs = require('fs');
const path = require('path');

const brainDir = "C:\\Users\\adts-\\.gemini\\antigravity-ide\\brain\\05514b75-0c70-4bc6-837a-dfc08a7e4faf";
const targetDir = path.join(__dirname, '..', 'public', 'images');

const imageMappings = [
  { src: "rarenuts_pouch_250g_1786340624218.png", dest: "california-almonds-250g.png" },
  { src: "rarenuts_roasted_jar_1786340636451.png", dest: "roasted-almonds-jar.png" },
  { src: "rarenuts_mahogany_chest_1786340649537.png", dest: "royal-almonds-wooden-box.png" },
  { src: "rarenuts_gift_unboxing_1786340665507.png", dest: "luxury-gift-box-unboxing.png" },
  { src: "rarenuts_window_pouch_1786340678242.png", dest: "almonds-pouch-window.png" },
  { src: "rarenuts_gift_unboxing_1786340665507.png", dest: "rarenuts-packaging-showcase.png" },
];

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

imageMappings.forEach(mapping => {
  const sourcePath = path.join(brainDir, mapping.src);
  const destPath = path.join(targetDir, mapping.dest);
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${mapping.src} -> ${mapping.dest}`);
  } else {
    console.warn(`Source missing: ${sourcePath}`);
  }
});
console.log('RARE NUTS image synchronization complete!');
