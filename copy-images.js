const fs = require('fs');
const path = require('path');

const artifactDir = "C:\\Users\\adts-\\.gemini\\antigravity-ide\\brain\\c8d0a509-ee56-4919-b4cb-c251aad8f01f";
const targetDir = path.join(__dirname, 'auremont-frontend', 'public', 'images');

const filesToCopy = [
  { source: "california_almonds_250g_1785480055337.png", dest: "california-almonds-250g.png" },
  { source: "roasted_almonds_jar_1785480066985.png", dest: "roasted-almonds-jar.png" },
  { source: "royal_almonds_wooden_box_1785480076945.png", dest: "royal-almonds-wooden-box.png" }
];

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log("Copying generated images...");

filesToCopy.forEach(file => {
  const srcPath = path.join(artifactDir, file.source);
  const destPath = path.join(targetDir, file.dest);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Successfully copied ${file.dest}`);
  } else {
    console.error(`❌ Source file not found: ${srcPath}`);
  }
});

console.log("Image copy complete!");
