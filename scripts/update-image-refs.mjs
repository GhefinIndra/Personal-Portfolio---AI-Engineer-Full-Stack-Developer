import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, dirname } from 'path';

const ASTRO_DIR = './src';
const EXTENSIONS = ['.astro', '.tsx', '.jsx', '.ts', '.js'];

let totalReplacements = 0;

function findFiles(dir, extensions) {
  const files = [];
  const items = readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findFiles(fullPath, extensions));
    } else {
      const ext = item.substring(item.lastIndexOf('.'));
      if (extensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  });
  
  return files;
}

function updateImagePaths(filePath) {
  let content = readFileSync(filePath, 'utf8');
  let replacements = 0;
  
  const pattern1 = /src=["']\/images\/projects\/([^"']+)\.(png|jpg|jpeg)["']/gi;
  content = content.replace(pattern1, (match, path, ext) => {
    replacements++;
    return `src="/images/projects/${path}.webp"`;
  });
  
  const pattern2 = /['"]\/images\/projects\/([^'"]+)\.(png|jpg|jpeg)['"]/gi;
  content = content.replace(pattern2, (match, path, ext) => {
    replacements++;
    return `'/images/projects/${path}.webp'`;
  });
  
  if (replacements > 0) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`[OK] ${filePath.split(/[\\/]/).pop()}: ${replacements} references updated`);
    totalReplacements += replacements;
  }
  
  return replacements;
}

console.log('Updating image references to WebP\n');

const files = findFiles(ASTRO_DIR, EXTENSIONS);
console.log(`Found ${files.length} files to scan\n`);
console.log('-'.repeat(60) + '\n');

files.forEach(file => {
  updateImagePaths(file);
});

console.log('\n' + '-'.repeat(60));
console.log(`\nComplete. ${totalReplacements} image references updated to .webp\n`);
console.log(`\n✨ Complete! ${totalReplacements} image references updated to .webp`);
console.log('💡 Test your site with: npm run dev\n');
