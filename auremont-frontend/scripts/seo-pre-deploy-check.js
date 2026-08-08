const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('  RARE NUTS — ENTERPRISE PRE-DEPLOYMENT SEO GATE    ');
console.log('====================================================');

const baseDir = path.join(__dirname, '..');
let errors = 0;

function checkFileExists(relPath, description) {
  const fullPath = path.join(baseDir, relPath);
  if (fs.existsSync(fullPath)) {
    console.log(`[PASS] ${description}: ${relPath}`);
    return true;
  } else {
    console.error(`[FAIL] ${description} NOT FOUND: ${relPath}`);
    errors++;
    return false;
  }
}

function checkFileContains(relPath, expectedString, description) {
  const fullPath = path.join(baseDir, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`[FAIL] ${description} File missing: ${relPath}`);
    errors++;
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  if (content.includes(expectedString)) {
    console.log(`[PASS] ${description}: '${expectedString}' verified in ${relPath}`);
    return true;
  } else {
    console.error(`[FAIL] ${description}: Missing '${expectedString}' in ${relPath}`);
    errors++;
    return false;
  }
}

// 1. Robots & Sitemap Drivers
checkFileExists('app/robots.ts', 'Dynamic Robots Driver');
checkFileExists('app/sitemap.ts', 'Dynamic Sitemap Driver');
checkFileContains('app/robots.ts', '/admin/', 'Robots Admin Disallow Rule');

// 2. Google Merchant Feed API
checkFileExists('app/api/feeds/google-merchant/route.ts', 'Google Merchant Feed API');

// 3. Centralized SEO Utility & Tests
checkFileExists('lib/seo.ts', 'Centralized SEO Helper Utility');
checkFileExists('tests/e2e/seo_audit.spec.ts', 'Automated Playwright SEO Quality Tests');

// 4. Critical Page Routes
checkFileExists('app/gifting/page.tsx', 'Luxury Gifting Hub Page');
checkFileExists('app/corporate-gifts/page.tsx', 'Corporate Gifting Page');
checkFileExists('app/press/page.tsx', 'Press & Media Room Page');

// 5. Documentation
checkFileExists('docs/seo/SEO_CURRENT_STATE.md', 'SEO Current State Inventory');
checkFileExists('docs/seo/SEO_AUDIT.md', 'SEO Audit Report');

console.log('----------------------------------------------------');
if (errors === 0) {
  console.log('✅ PRE-DEPLOYMENT SEO QUALITY GATE: ALL CHECKS PASSED');
  console.log('====================================================');
  process.exit(0);
} else {
  console.error(`❌ PRE-DEPLOYMENT SEO QUALITY GATE FAILED WITH ${errors} ERRORS`);
  console.log('====================================================');
  process.exit(1);
}
