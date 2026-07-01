import fs from 'fs';
import path from 'path';

// 取得傳入的版本號，例如 v1.1.0
const tag = process.argv[2];
if (!tag) {
  console.error("Please provide a tag name (e.g. v1.1.0)");
  process.exit(1);
}
const version = tag.replace(/^v/, ''); // 變成 1.1.0

function getChangelogNotes(ver) {
  const changelogPath = 'CHANGELOG.md';
  if (!fs.existsSync(changelogPath)) {
    return `Release v${ver}`;
  }
  const content = fs.readFileSync(changelogPath, 'utf8');
  // 匹配 ## vX.Y.Z 或 ## X.Y.Z 直到下一個 ## 或者是檔案結尾
  const escapedVer = ver.replace(/\./g, '\\.');
  const regex = new RegExp(`##\\s+v?${escapedVer}[\\s\\S]*?(?=\\n##|$)`, 'i');
  const match = content.match(regex);
  if (match) {
    const lines = match[0].split('\n');
    // 去掉第一行標題，過濾出內容行
    const notesLines = lines.slice(1).map(line => line.trim()).filter(line => line.length > 0);
    if (notesLines.length > 0) {
      return notesLines.join('\n');
    }
  }
  return `Release v${ver}`;
}

// 遞歸尋找指定目錄下所有特定後綴的檔案
function findFilesByExtension(dir, ext, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findFilesByExtension(filePath, ext, fileList);
    } else if (file.endsWith(ext)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

async function main() {
  const manifestPath = 'update-manifest.json';
  const searchDir = process.argv[3] || '.'; // 可從引數傳入根目錄，預設為當前目錄

  console.log(`Searching for signature files in: ${searchDir}`);
  const sigFiles = findFilesByExtension(searchDir, '.sig');

  if (sigFiles.length === 0) {
    console.error(`No .sig files found in directory: ${searchDir}`);
    process.exit(1);
  }

  let manifest = {};
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (err) {
      console.warn("Could not parse existing manifest, creating a new one.");
    }
  }

  // 確保 platforms 物件存在
  if (!manifest.platforms) {
    manifest.platforms = {};
  }

  let hasWindows = false;
  let hasMac = false;

  for (const sigPath of sigFiles) {
    const sigFile = path.basename(sigPath);
    console.log(`Processing signature file: ${sigPath}`);
    const signature = fs.readFileSync(sigPath, 'utf8').trim();
    const targetFile = sigFile.replace(/\.sig$/, '');

    // 檢查對應的二進制檔案是否存在
    const targetFilePath = path.join(path.dirname(sigPath), targetFile);
    if (!fs.existsSync(targetFilePath)) {
      console.warn(`Warning: Target installer file not found at: ${targetFilePath}`);
    }

    if (sigFile.endsWith('.exe.sig')) {
      // Windows 平台
      manifest.platforms['windows-x86_64'] = {
        signature: signature,
        url: `https://github.com/dbshadow/md2pdf-rust/releases/download/${tag}/${targetFile}`
      };
      hasWindows = true;
      console.log(`Added Windows configuration for: ${targetFile}`);
    } else if (sigFile.endsWith('.tar.gz.sig')) {
      // macOS 平台 (darwin-x86_64 和 darwin-aarch64 共享相同的更新包簽名)
      manifest.platforms['darwin-x86_64'] = {
        signature: signature,
        url: `https://github.com/dbshadow/md2pdf-rust/releases/download/${tag}/${targetFile}`
      };
      manifest.platforms['darwin-aarch64'] = {
        signature: signature,
        url: `https://github.com/dbshadow/md2pdf-rust/releases/download/${tag}/${targetFile}`
      };
      hasMac = true;
      console.log(`Added macOS (universal) configurations for: ${targetFile}`);
    }
  }

  if (!hasWindows && !hasMac) {
    console.error("Error: Could not identify any Windows (.exe.sig) or macOS (.tar.gz.sig) signature files.");
    process.exit(1);
  }

  // 從本地 CHANGELOG.md 解析當前版本的更新日誌
  const notes = getChangelogNotes(version);
  console.log(`Parsed release notes:\n${notes}`);

  // 更新 manifest 基本資訊
  manifest.version = version;
  manifest.notes = notes;
  manifest.pub_date = new Date().toISOString();

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`Successfully updated ${manifestPath} for version ${version}`);
}

main().catch(err => {
  console.error("Main execution failed:", err);
  process.exit(1);
});
