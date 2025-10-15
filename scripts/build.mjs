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

async function copyRootFiles() {
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    if (shouldCopyRootFile(entry.name, entry.isFile())) {
      const src = path.join(root, entry.name);
      const dest = path.join(dist, entry.name);
      await fs.copyFile(src, dest).catch(() => {});
    }
  }
}

async function copyImagesDir() {
  const imagesSrc = path.join(root, 'images');
  try {
    const stat = await fs.stat(imagesSrc);
    if (stat.isDirectory()) {
      const imagesDest = path.join(dist, 'images');
      // Node 18+ supports fs.cp
      await fs.cp(imagesSrc, imagesDest, { recursive: true, force: true });
    }
  } catch {
    // no images dir; skip
  }
}

async function copyWorkerAsPageFunction() {
  // Copy worker.js to dist/_worker.js for Cloudflare Pages Functions
  const workerSrc = path.join(root, 'src', 'worker.js');
  const workerDest = path.join(dist, '_worker.js');
  try {
    await fs.copyFile(workerSrc, workerDest);
    console.log('Copied worker.js to dist/_worker.js (Pages Function)');
  } catch (err) {
    console.warn('Could not copy worker.js:', err.message);
  }
}

async function main() {
  await ensureEmptyDir(dist);
  await copyRootFiles();
  await copyImagesDir();
  await copyWorkerAsPageFunction();
  console.log('Staged static site to dist');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
