import sharp from 'sharp';
import { readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';

const QUALITY = 88;
const INPUT_DIR = './public/images/projects';
const FORMATS = ['.png', '.jpg', '.jpeg'];

console.log('Image Optimization Started\n');

let totalOriginalSize = 0;
let totalOptimizedSize = 0;
let processedCount = 0;

function findImages(dir) {
  const images = [];
  const items = readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      images.push(...findImages(fullPath));
    } else {
      const ext = item.toLowerCase().substring(item.lastIndexOf('.'));
      if (FORMATS.includes(ext)) {
        images.push(fullPath);
      }
    }
  });
  
  return images;
}

function getFileSizeKB(filePath) {
  const stats = statSync(filePath);
  return (stats.size / 1024).toFixed(2);
}

async function optimizeImage(imagePath) {
  try {
    const originalSize = parseFloat(getFileSizeKB(imagePath));
    const outputPath = imagePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    
    if (existsSync(outputPath)) {
      const existingSize = parseFloat(getFileSizeKB(outputPath));
      if (existingSize < originalSize) {
        console.log(`[SKIP] ${imagePath.split('\\').pop()} (WebP exists)`);
        return;
      }
    }
    
    await sharp(imagePath)
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(outputPath);
    
    const optimizedSize = parseFloat(getFileSizeKB(outputPath));
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    totalOriginalSize += originalSize;
    totalOptimizedSize += optimizedSize;
    processedCount++;
    
    console.log(`[OK] ${imagePath.split('\\').pop()}`);
    console.log(`     ${originalSize} KB -> ${optimizedSize} KB (${savings}% reduction)\n`);
  } catch (error) {
    console.error(`[ERROR] Failed to optimize ${imagePath}: ${error.message}\n`);
  }
}

async function main() {
  if (!existsSync(INPUT_DIR)) {
    console.error(`[ERROR] Directory not found: ${INPUT_DIR}`);
    process.exit(1);
  }
  
  const images = findImages(INPUT_DIR);
  
  if (images.length === 0) {
    console.log('No images found to optimize.');
    return;
  }
  
  console.log(`Found ${images.length} images to process\n`);
  console.log('-'.repeat(60) + '\n');
  
  for (const image of images) {
    await optimizeImage(image);
  }
  
  console.log('-'.repeat(60));
  console.log('\nOptimization Summary:');
  console.log(`Images processed: ${processedCount}`);
  console.log(`Original size: ${totalOriginalSize.toFixed(2)} KB`);
  console.log(`Optimized size: ${totalOptimizedSize.toFixed(2)} KB`);
  
  if (totalOriginalSize > 0) {
    const totalSavings = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
    const savedKB = (totalOriginalSize - totalOptimizedSize).toFixed(2);
    console.log(`Total savings: ${savedKB} KB (${totalSavings}% reduction)`);
  }
  
  console.log('\nComplete. WebP files created alongside originals.\n');
}

main().catch(console.error);
