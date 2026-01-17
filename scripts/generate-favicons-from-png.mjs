import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const iconSizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' }
];

const ogImageSize = { width: 1200, height: 630 };
const faviconFit = 'contain';

async function generateFavicons() {
  const inputPath = path.resolve('C:/MyCV/logo.png');
  const outputDir = path.resolve('public');
  const ogOutputDir = path.resolve('public/images');

  if (!fs.existsSync(inputPath)) {
    console.log('[ERROR] Icon not found:', inputPath);
    return;
  }

  console.log('[START] Generating favicons from logo.png...\n');

  for (const { size, name } of iconSizes) {
    try {
      await sharp(inputPath)
        .trim()
        .resize(size, size, {
          fit: faviconFit,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(path.join(outputDir, name));
      
      console.log(`[OK] Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.log(`[ERROR] Failed to generate ${name}:`, error.message);
    }
  }

  if (!fs.existsSync(ogOutputDir)) {
    fs.mkdirSync(ogOutputDir, { recursive: true });
  }

  try {
    await sharp(inputPath)
      .resize(ogImageSize.width, ogImageSize.height, {
        fit: 'contain',
        background: { r: 15, g: 23, b: 42, alpha: 1 }
      })
      .png()
      .toFile(path.join(ogOutputDir, 'og-image.png'));
    
    console.log(`[OK] Generated images/og-image.png (${ogImageSize.width}x${ogImageSize.height})`);
  } catch (error) {
    console.log('[ERROR] Failed to generate images/og-image.png:', error.message);
  }

  console.log('\n[DONE] All favicons generated successfully!');
}

generateFavicons();
