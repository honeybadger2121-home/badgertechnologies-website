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

async function copyDirectories() {
  const directories = ['images', 'assets', 'pages'];
  
  for (const dirName of directories) {
    const srcDir = path.join(root, dirName);
    try {
      const stat = await fs.stat(srcDir);
      if (stat.isDirectory()) {
        const destDir = path.join(dist, dirName);
        await fs.cp(srcDir, destDir, { recursive: true, force: true });
        console.log(`Copied ${dirName} directory`);
      }
    } catch {
      // Directory doesn't exist; skip
    }
  }
}

async function main() {
  await ensureEmptyDir(dist);
  await copyRootFiles();
  await copyDirectories();
  console.log('Built static site for Cloudflare Pages deployment');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
