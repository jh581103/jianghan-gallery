// 核对批 3 改名 11 小组的当前状态 + id=104 bug
const fs = require('fs');
const path = require('path');
const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';

const html = fs.readFileSync(path.join(repoDir, 'index.html'), 'utf8');

// 匹配 {"id":数字,..."title":"...","thumbnail":"..."} 的最小片段
const re = /"id"\s*:\s*(\d+)\s*,\s*"title"\s*:\s*"([^"]+)"\s*,\s*"medium"\s*:\s*"[^"]+"\s*,\s*"platform"\s*:\s*"[^"]+"\s*,\s*"url"\s*:\s*"[^"]+"\s*,\s*"description"\s*:\s*"[^"]*"\s*,\s*"thumbnail"\s*:\s*"([^"]+)"/g;

const targets = [18, 54, 56, 57, 62, 63, 66, 68, 47, 48, 107, 108, 109, 113, 70, 111, 78, 79, 81, 82, 129, 131, 104];
const map = new Map();

let m;
while ((m = re.exec(html)) !== null) {
  const id = parseInt(m[1], 10);
  if (targets.includes(id)) {
    map.set(id, { id, title: m[2], thumb: m[3] });
  }
}

// 检查缩略图实际位置
const thumbsDir = path.join(repoDir, 'thumbnails');
const rootDir = repoDir;

console.log('=== id=104 bug 核对 ===');
const id104 = map.get(104);
if (id104) {
  console.log('当前 index.html:', id104.thumb);
  const fullName = id104.thumb.replace(/^thumbnails\//, '');
  const inThumbs = fs.existsSync(path.join(thumbsDir, fullName));
  const inRoot = fs.existsSync(path.join(rootDir, fullName));
  console.log('thumbs/ 有:', inThumbs);
  console.log('仓库根 有:', inRoot);
}

console.log('\n=== 批 3 改名 22 个核对 ===');
const sorted = targets.filter(id => id !== 104).sort((a, b) => a - b);
for (const id of sorted) {
  const e = map.get(id);
  if (!e) {
    console.log(`id=${id}: ❌ 没找到`);
    continue;
  }
  // 推断缩略图实际位置
  const fullName = e.thumb.replace(/^thumbnails\//, '');
  const inThumbs = fs.existsSync(path.join(thumbsDir, fullName));
  const inRoot = fs.existsSync(path.join(rootDir, fullName));
  const loc = inThumbs ? 'thumbnails/' : (inRoot ? '仓库根' : '❌找不到');
  console.log(`id=${id}\t[${loc}]\t${e.title}`);
}
