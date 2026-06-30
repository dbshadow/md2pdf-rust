import fs from 'fs';
import path from 'path';

// 取得傳入的版本號，例如 v1.1.0
const tag = process.argv[2];
if (!tag) {
  console.error("Please provide a tag name (e.g. v1.1.0)");
  process.exit(1);
}
const version = tag.replace(/^v/, ''); // 變成 1.1.0

const sigPath = path.join('src-tauri', 'target', 'release', 'bundle', 'nsis', `md2pdf_${version}_x64-setup.exe.sig`);
const manifestPath = 'update-manifest.json';

if (!fs.existsSync(sigPath)) {
  console.error(`Signature file not found at: ${sigPath}`);
  process.exit(1);
}

const signature = fs.readFileSync(sigPath, 'utf8').trim();

let manifest = {};
if (fs.existsSync(manifestPath)) {
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (err) {
    console.warn("Could not parse existing manifest, creating a new one.");
  }
}

// 更新 manifest
manifest.version = version;
manifest.pub_date = new Date().toISOString();
if (!manifest.platforms) {
  manifest.platforms = {};
}
manifest.platforms['windows-x86_64'] = {
  signature: signature,
  url: `https://github.com/dbshadow/md2pdf-rust/releases/download/${tag}/md2pdf_${version}_x64-setup.exe`
};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Successfully updated ${manifestPath} for version ${version}`);
