import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';

const OUTPUT_DIR = './public';

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('Generating favicons and OG image\n');

const PRIMARY_COLOR = '#2563EB';
const TEXT_COLOR = '#1F2937';
const BG_COLOR = '#F9FAFB';

const faviconSVG = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="${PRIMARY_COLOR}" rx="64"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
        font-family="Arial, sans-serif" font-size="280" font-weight="bold" fill="white">GI</text>
</svg>`;

const ogImageSVG = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${BG_COLOR}"/>
  
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${PRIMARY_COLOR};stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:${PRIMARY_COLOR};stop-opacity:0.05" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#grad)"/>
  
  <circle cx="1000" cy="150" r="200" fill="${PRIMARY_COLOR}" opacity="0.05"/>
  <circle cx="200" cy="500" r="150" fill="${PRIMARY_COLOR}" opacity="0.05"/>
  
  <text x="100" y="220" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="${TEXT_COLOR}">
    Ghefin Indra
  </text>
  <text x="100" y="300" font-family="Arial, sans-serif" font-size="42" font-weight="600" fill="${PRIMARY_COLOR}">
    AI Engineer &amp; Full Stack Developer
  </text>
  <text x="100" y="380" font-family="Arial, sans-serif" font-size="32" fill="${TEXT_COLOR}" opacity="0.6">
    Building scalable solutions across
  </text>
  <text x="100" y="430" font-family="Arial, sans-serif" font-size="32" fill="${TEXT_COLOR}" opacity="0.6">
    web, mobile, and AI platforms.
  </text>
  
  <rect x="100" y="500" width="300" height="60" fill="${PRIMARY_COLOR}" rx="30"/>
  <text x="250" y="538" font-family="Arial, sans-serif" font-size="28" font-weight="bold" 
        fill="white" text-anchor="middle">ghefinindra.dev</text>
</svg>`;

async function generateImages() {
  try {
    await sharp(Buffer.from(faviconSVG))
      .png()
      .toFile(`${OUTPUT_DIR}/favicon.svg`);
    console.log('[OK] favicon.svg created');

    await sharp(Buffer.from(faviconSVG))
      .resize(32, 32)
      .png()
      .toFile(`${OUTPUT_DIR}/favicon-32x32.png`);
    console.log('[OK] favicon-32x32.png created');

    await sharp(Buffer.from(faviconSVG))
      .resize(16, 16)
      .png()
      .toFile(`${OUTPUT_DIR}/favicon-16x16.png`);
    console.log('[OK] favicon-16x16.png created');

    await sharp(Buffer.from(faviconSVG))
      .resize(180, 180)
      .png()
      .toFile(`${OUTPUT_DIR}/apple-touch-icon.png`);
    console.log('[OK] apple-touch-icon.png created');

    await sharp(Buffer.from(faviconSVG))
      .resize(192, 192)
      .png()
      .toFile(`${OUTPUT_DIR}/icon-192x192.png`);
    console.log('[OK] icon-192x192.png created');

    await sharp(Buffer.from(faviconSVG))
      .resize(512, 512)
      .png()
      .toFile(`${OUTPUT_DIR}/icon-512x512.png`);
    console.log('[OK] icon-512x512.png created');

    await sharp(Buffer.from(ogImageSVG))
      .png()
      .toFile(`${OUTPUT_DIR}/images/og-image.png`);
    console.log('[OK] og-image.png created');

    console.log('\nComplete. All icons and OG image generated successfully.\n');
  } catch (error) {
    console.error('[ERROR] Error generating images:', error);
  }
}

generateImages();
