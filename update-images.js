const fs = require('fs');
const path = require('path');

const brainDir = "C:\\Users\\adts-\\.gemini\\antigravity-ide\\brain\\676ddd72-d9a9-4d0b-8640-752457094892";
const targetDir = path.join(__dirname, 'auremont-frontend', 'public', 'images');

const imageMappings = [
  { src: "california_almonds_pouch_front_1785905606676.png", dest: "california-almonds-250g.png" },
  { src: "roasted_almonds_glass_jar_1785905623854.png", dest: "roasted-almonds-jar.png" },
  { src: "royal_almonds_luxury_box_1785905637792.png", dest: "royal-almonds-wooden-box.png" },
  { src: "almonds_pouch_window_1785905653154.png", dest: "almonds-pouch-window.png" },
  { src: "luxury_gift_box_unboxing_1785905667489.png", dest: "luxury-gift-box-unboxing.png" },
  { src: "media__1785905539011.jpg", dest: "auremont-packaging-showcase.jpg" }
];

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log("Copying updated luxury images...");

imageMappings.forEach(mapping => {
  const sourcePath = path.join(brainDir, mapping.src);
  const destPath = path.join(targetDir, mapping.dest);

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${mapping.src} -> ${mapping.dest}`);
  } else {
    console.error(`❌ Source missing: ${sourcePath}`);
  }
});

console.log("All luxury product images updated successfully!");
