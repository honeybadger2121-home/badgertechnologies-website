import { promises as fs } from 'fs';
import path from 'path';

const root = process.cwd();
const dist = path.join(root, 'dist');

const rootFilesToCopy = [
  // extensions
  '.html', '.css', '.js',
  // explicit files
  'favicon.png', 'manifest.json', 'robots.txt', 'sitemap.xml'
];

async function ensureEmptyDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

function shouldCopyRootFile(name, isFile) {
  if (!isFile) return false;
  if (rootFilesToCopy.includes(name)) return true;
  const ext = path.extname(name).toLowerCase();
  return rootFilesToCopy.includes(ext);
}

// Simple CSS minification
function minifyCSS(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove unnecessary whitespace
    .replace(/\s+/g, ' ')
    // Remove spaces around certain characters
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    // Remove trailing semicolon before closing brace
    .replace(/;}/g, '}')
    // Trim
    .trim();
}

// Simple HTML minification
function minifyHTML(html) {
  return html
    // Remove HTML comments (but preserve conditional comments)
    .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
    // Collapse whitespace
    .replace(/>\s+</g, '><')
    // Remove unnecessary whitespace in text nodes
    .replace(/\s+/g, ' ')
    .trim();
}

async function copyAndOptimizeRootFiles() {
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    if (shouldCopyRootFile(entry.name, entry.isFile())) {
      const src = path.join(root, entry.name);
      const dest = path.join(dist, entry.name);
      
      try {
        const ext = path.extname(entry.name).toLowerCase();
        let content = await fs.readFile(src, 'utf8');
        
        // Apply minification based on file type
        if (ext === '.css') {
          content = minifyCSS(content);
          console.log(`Minified CSS: ${entry.name}`);
        } else if (ext === '.html') {
          content = minifyHTML(content);
          console.log(`Minified HTML: ${entry.name}`);
        }
        
        await fs.writeFile(dest, content);
      } catch (error) {
        // If minification fails, copy original file
        await fs.copyFile(src, dest).catch(() => {});
      }
    }
  }
}

async function copyDirectories() {
  const directories = ['images', 'assets', 'pages'];
  
  for (const dirName of directories) {
    const srcDir = path.join(root, dirName);
    try {
      const stat = await fs.stat(srcDir);
      if (stat.isDirectory()) {
        const destDir = path.join(dist, dirName);
        await fs.cp(srcDir, destDir, { recursive: true, force: true });
        
        // Optimize CSS files in assets directory
        if (dirName === 'assets') {
          await optimizeAssetsDirectory(destDir);
        }
        
        console.log(`Copied ${dirName} directory`);
      }
    } catch {
      // Directory doesn't exist; skip
    }
  }
}

async function optimizeAssetsDirectory(assetsDir) {
  try {
    const cssDir = path.join(assetsDir, 'css');
    const cssFiles = await fs.readdir(cssDir);
    
    for (const file of cssFiles) {
      if (file.endsWith('.css')) {
        const filePath = path.join(cssDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const minified = minifyCSS(content);
        await fs.writeFile(filePath, minified);
        console.log(`Minified CSS: assets/css/${file}`);
      }
    }
  } catch {
    // CSS directory doesn't exist or error occurred; skip
  }
}

async function copyFavicons() {
  // Copy favicon files to root for easier access
  const faviconSources = [
    { src: 'images/icons/favicon.ico', dest: 'favicon.ico' },
    { src: 'images/icons/favicon.png', dest: 'favicon.png' }
  ];
  
  for (const favicon of faviconSources) {
    const srcPath = path.join(root, favicon.src);
    const destPath = path.join(dist, favicon.dest);
    try {
      await fs.copyFile(srcPath, destPath);
      console.log(`Copied ${favicon.dest} to root`);
    } catch {
      // File doesn't exist; skip
    }
  }
}

async function main() {
  console.log('🚀 Starting optimized build process...');
  await ensureEmptyDir(dist);
  await copyAndOptimizeRootFiles();
  await copyDirectories();
  await copyFavicons();
  console.log('✅ Built optimized static site for Cloudflare Pages deployment');
}

main().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
