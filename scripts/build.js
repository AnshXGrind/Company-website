const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

const EXCLUDE = new Set([
  'node_modules', 'dist', 'backups', 'self_host', 'uploads', 'access.log', 'leads.json', '.git', '.vercel', '.vercelignore', '.env'
]);

async function rmDir(dir) {
  if (!fs.existsSync(dir)) return;
  await fs.promises.rm(dir, { recursive: true, force: true });
}

async function copyRecursive(src, dest) {
  const stat = await fs.promises.stat(src);
  if (stat.isDirectory()) {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src);
    for (const e of entries) {
      const s = path.join(src, e);
      const d = path.join(dest, e);
      await copyRecursive(s, d);
    }
  } else {
    await fs.promises.mkdir(path.dirname(dest), { recursive: true });
    await fs.promises.copyFile(src, dest);
  }
}

(async () => {
  try {
    console.log('Preparing dist directory...');
    await rmDir(dist);
    await fs.promises.mkdir(dist, { recursive: true });

    const entries = await fs.promises.readdir(root);
    for (const name of entries) {
      if (EXCLUDE.has(name)) continue;
      // skip hidden files like .env.* if needed
      const src = path.join(root, name);
      const dest = path.join(dist, name);
      // Only copy expected top-level items (but copy others too unless excluded)
      await copyRecursive(src, dest);
    }

    console.log('Build complete — `dist` directory is ready.');
  } catch (err) {
    console.error('Build failed:', err);
    process.exitCode = 1;
  }
})();
