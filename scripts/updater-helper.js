import fs from 'fs';
import path from 'path';

// 取得傳入的版本號，例如 v1.1.0
const tag = process.argv[2];
if (!tag) {
  console.error("Please provide a tag name (e.g. v1.1.0)");
  process.exit(1);
}
const version = tag.replace(/^v/, ''); // 變成 1.1.0

const nsisDir = path.join('src-tauri', 'target', 'release', 'bundle', 'nsis');
const manifestPath = 'update-manifest.json';

if (!fs.existsSync(nsisDir)) {
  console.error(`NSIS bundle directory not found at: ${nsisDir}`);
  process.exit(1);
}

// 尋找以 .sig 結尾的檔案
const files = fs.readdirSync(nsisDir);
const sigFile = files.find(f => f.endsWith('.sig'));

if (!sigFile) {
  console.error(`No .sig file found in directory: ${nsisDir}`);
  console.error("Please make sure TAURI_SIGNING_PRIVATE_KEY is correctly set in GitHub Secrets.");
  process.exit(1);
}

const sigPath = path.join(nsisDir, sigFile);
console.log(`Found signature file at: ${sigPath}`);
const signature = fs.readFileSync(sigPath, 'utf8').trim();

// 動態取得對應的安裝檔名（把 .sig 去掉就是安裝包檔名）
const exeFile = sigFile.replace(/\.sig$/, '');
const exePath = path.join(nsisDir, exeFile);
if (!fs.existsSync(exePath)) {
  console.error(`Installer file not found at: ${exePath}`);
  process.exit(1);
}
console.log(`Found installer file at: ${exePath}`);

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
  url: `https://github.com/dbshadow/md2pdf-rust/releases/download/${tag}/${exeFile}`
};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Successfully updated ${manifestPath} for version ${version}`);
