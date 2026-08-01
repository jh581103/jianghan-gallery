// 批 3 改名：11 组 21 个加序号 + 修 id=104 thumb 字段 + 21 个缩略图移到 thumbnails/
// 策略：
//   1) 改 index.html（title + thumbnail 字段），按 id 锁定
//   2) 移动缩略图（仓库根 → thumbnails/），用 fs.renameSync 保 git rename 检测
//   3) 旧缩略图（仓库根旧名）mavis-trash
//   4) 验证

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
const indexPath = path.join(repoDir, 'index.html');
const thumbsDir = path.join(repoDir, 'thumbnails');
const trashCmd = 'C:\\Users\\HUAWEI\\.minimax\\bin\\mavis-trash.cmd';

// 改动清单：每个 = { id, newTitle, newThumb, oldRootThumb? }
const changes = [
  // 元通古镇
  { id: 18, newTitle: '旅游_元通古镇（1）：留影', oldRootThumb: '元通古镇 留影.jpg', newThumbName: '旅游_元通古镇（1）：留影.jpg' },
  { id: 54, newTitle: '旅游_元通古镇（2）：留影', oldRootThumb: '旅游_元通古镇留影.jpg', newThumbName: '旅游_元通古镇（2）：留影.jpg' },
  // 新场古镇
  { id: 56, newTitle: '旅游_新场古镇（1）：实拍', oldRootThumb: '旅游_新场古镇实拍.jpg', newThumbName: '旅游_新场古镇（1）：实拍.jpg' },
  { id: 57, newTitle: '旅游_新场古镇（2）：留影', oldRootThumb: '旅游_新场古镇留影.jpg', newThumbName: '旅游_新场古镇（2）：留影.jpg' },
  // 街子古镇
  { id: 62, newTitle: '旅游_街子古镇（1）：实拍', oldRootThumb: '旅游_街子古镇实拍.jpg', newThumbName: '旅游_街子古镇（1）：实拍.jpg' },
  { id: 63, newTitle: '旅游_街子古镇（2）：留影', oldRootThumb: '旅游_街子古镇留影.jpg', newThumbName: '旅游_街子古镇（2）：留影.jpg' },
  // 江油太白碑林
  { id: 66, newTitle: '旅游_江油\u201C太白碑林\u201D（1）：留影', oldRootThumb: '旅游_江油\u201C太白碑林\u201D留影.jpg', newThumbName: '旅游_江油\u201C太白碑林\u201D（1）：留影.jpg' },
  { id: 68, newTitle: '旅游_江油\u201C太白碑林\u201D（2）：地面石刻诗', oldRootThumb: '旅游_江油\u201C太白碑林\u201D地面石刻诗.jpg', newThumbName: '旅游_江油\u201C太白碑林\u201D（2）：地面石刻诗.jpg' },
  // 广西南宁
  { id: 47, newTitle: '旅游_广西南宁（1）：逛街留影', oldRootThumb: '旅游_广西南宁逛街留影.jpg', newThumbName: '旅游_广西南宁（1）：逛街留影.jpg' },
  { id: 48, newTitle: '旅游_广西南宁（2）：皇冠假日酒店儿童房留影', oldRootThumb: '旅游_广西南宁皇冠假日酒店儿童房留影.jpg', newThumbName: '旅游_广西南宁（2）：皇冠假日酒店儿童房留影.jpg' },
  // 成都金沙遗址博物馆
  { id: 107, newTitle: '旅游_成都金沙遗址博物馆（1）：实拍', oldRootThumb: '旅游_成都金沙遗址博物馆实拍.jpg', newThumbName: '旅游_成都金沙遗址博物馆（1）：实拍.jpg' },
  { id: 108, newTitle: '旅游_成都金沙遗址博物馆（2）：留影', oldRootThumb: '旅游_成都金沙遗址博物馆留影.jpg', newThumbName: '旅游_成都金沙遗址博物馆（2）：留影.jpg' },
  // 成都大慈寺
  { id: 109, newTitle: '旅游_成都大慈寺（1）：实拍', oldRootThumb: '旅游_成都大慈寺实拍.jpg', newThumbName: '旅游_成都大慈寺（1）：实拍.jpg' },
  { id: 113, newTitle: '旅游_成都大慈寺（2）：留影', oldRootThumb: '旅游_成都大慈寺留影.jpg', newThumbName: '旅游_成都大慈寺（2）：留影.jpg' },
  // 成都双子塔
  { id: 70, newTitle: '旅游_成都双子塔（1）：最美天际线实拍', oldRootThumb: '旅游_成都最美天际线\u201C双子塔\u201D实拍.jpg', newThumbName: '旅游_成都双子塔（1）：最美天际线实拍.jpg' },
  { id: 111, newTitle: '旅游_成都双子塔（2）：实拍', oldRootThumb: '旅游_成都双子塔实拍.jpg', newThumbName: '旅游_成都双子塔（2）：实拍.jpg' },
  // 青城山
  { id: 78, newTitle: '旅游_青城山（1）：问道实拍', oldRootThumb: '旅游_问道青城山实拍.jpg', newThumbName: '旅游_青城山（1）：问道实拍.jpg' },
  { id: 79, newTitle: '旅游_青城山（2）：上清宫留影', oldRootThumb: '旅游_青城山上清宫留影.jpg', newThumbName: '旅游_青城山（2）：上清宫留影.jpg' },
  // 花水湾
  { id: 81, newTitle: '旅游_花水湾（1）：夏日度假四季温泉实拍', oldRootThumb: '旅游_夏日度假四季温泉花水湾实拍.jpg', newThumbName: '旅游_花水湾（1）：夏日度假四季温泉实拍.jpg' },
  { id: 82, newTitle: '旅游_花水湾（2）：中铁温泉大酒店留影', oldRootThumb: '旅游_中铁花水湾温泉大酒店留影.jpg', newThumbName: '旅游_花水湾（2）：中铁温泉大酒店留影.jpg' },
  // 成都望丛祠 (id=131 缩略图已在 thumbnails/，不动)
  { id: 129, newTitle: '旅游_成都望丛祠（1）：实拍', oldRootThumb: '旅游_成都望丛祠实拍.jpg', newThumbName: '旅游_成都望丛祠（1）：实拍.jpg' },
];

// id=104 修复：只改 thumb 字段
const id104Fix = {
  id: 104,
  oldThumb: 'thumbnails/旅游1号公路（4）：加州美景实拍.jpg',
  newThumb: 'thumbnails/旅游_美国1号公路（4）：加州美景实拍.jpg',
};

console.log('=== 步骤 1: 改 index.html ===');
let html = fs.readFileSync(indexPath, 'utf8');

for (const c of changes) {
  // 用 id 锁定：找到 "id": <c.id>, 这行的开始，到下一个 "}," 之前
  // 用正则匹配整段对象
  const idPattern = new RegExp(`(\\{[^{}]*"id"\\s*:\\s*${c.id}\\s*,\\s*"title"\\s*:\\s*")([^"]+)("[^{}]*?"thumbnail"\\s*:\\s*")([^"]+)(")`);
  const m = html.match(idPattern);
  if (!m) {
    console.log(`  ❌ id=${c.id} 没匹配到`);
    continue;
  }
  const oldTitle = m[2];
  const oldThumbField = m[4];
  const newThumbField = `thumbnails/${c.newThumbName}`;
  if (oldTitle === c.newTitle && oldThumbField === newThumbField) {
    console.log(`  id=${c.id} 已为目标，跳过`);
    continue;
  }
  // 检查格式兼容性：原 thumb 字段是 thumbnails/ 还是仓库根？
  const isOldInThumbs = oldThumbField.startsWith('thumbnails/');
  console.log(`  id=${c.id} title: ${oldTitle} → ${c.newTitle}`);
  console.log(`           thumb: ${oldThumbField} → ${newThumbField} (${isOldInThumbs ? '原在thumbs' : '原在根'})`);
  // 替换
  const newSeg = `${m[1]}${c.newTitle}${m[3]}${newThumbField}${m[5]}`;
  html = html.replace(idPattern, newSeg);
}

// id=104 修复（按完整 thumb 字段定位）
const id104Pattern = new RegExp(`(\\{[^{}]*"id"\\s*:\\s*104[^{}]*?"thumbnail"\\s*:\\s*")${id104Fix.oldThumb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(")`);
if (id104Pattern.test(html)) {
  html = html.replace(id104Pattern, `$1${id104Fix.newThumb}$2`);
  console.log(`  id=104 thumb 字段已修复: ${id104Fix.oldThumb} → ${id104Fix.newThumb}`);
} else {
  console.log(`  ❌ id=104 thumb 修复模式未匹配`);
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('  index.html 已写回');

// === 步骤 2: 移动缩略图 ===
console.log('\n=== 步骤 2: 移动缩略图（仓库根 → thumbnails/）===');
for (const c of changes) {
  if (!c.oldRootThumb) continue; // id=131 等
  const oldPath = path.join(repoDir, c.oldRootThumb);
  const newPath = path.join(thumbsDir, c.newThumbName);
  if (!fs.existsSync(oldPath)) {
    console.log(`  ⚠️ id=${c.id} 原缩略图不存在: ${c.oldRootThumb}`);
    continue;
  }
  if (fs.existsSync(newPath)) {
    console.log(`  ⚠️ id=${c.id} 目标已存在: ${c.newThumbName}，跳过移动`);
    continue;
  }
  fs.renameSync(oldPath, newPath);
  console.log(`  ✓ id=${c.id} ${c.oldRootThumb} → thumbnails/${c.newThumbName}`);
}

console.log('\n=== 步骤 3: 验证 ===');
// 重新读 index.html，验证所有改动落地
const newHtml = fs.readFileSync(indexPath, 'utf8');
for (const c of changes) {
  const hasNewTitle = newHtml.includes(c.newTitle);
  const hasNewThumb = newHtml.includes(`thumbnails/${c.newThumbName}`);
  const status = (hasNewTitle && hasNewThumb) ? '✓' : '❌';
  console.log(`  ${status} id=${c.id}: title=${hasNewTitle} thumb=${hasNewThumb}`);
}
const has104 = newHtml.includes(id104Fix.newThumb);
console.log(`  ${has104 ? '✓' : '❌'} id=104 thumb 修复: ${id104Fix.newThumb}`);

// 验证旧缩略图在仓库根不存在
console.log('\n=== 步骤 4: 旧缩略图 mavis-trash ===');
for (const c of changes) {
  if (!c.oldRootThumb) continue;
  const oldPath = path.join(repoDir, c.oldRootThumb);
  if (fs.existsSync(oldPath)) {
    // 用 PowerShell 调 mavis-trash（中文路径 .cmd 在 node spawnSync 失败）
    const psCmd = `& '${trashCmd}' '${oldPath}'`;
    const r = spawnSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', psCmd], { encoding: 'utf8' });
    if (r.status === 0) {
      console.log(`  ✓ mavis-trash: ${c.oldRootThumb}`);
    } else {
      console.log(`  ❌ mavis-trash 失败: ${c.oldRootThumb}`);
      console.log(`     stdout: ${r.stdout}`);
      console.log(`     stderr: ${r.stderr}`);
    }
  } else {
    console.log(`  - 已不存在: ${c.oldRootThumb}`);
  }
}

console.log('\n=== 完成 ===');
console.log('接下来手动跑 git add + commit + push');
