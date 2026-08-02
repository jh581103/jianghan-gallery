// id=150: 旅游_成都三圣花香随拍
// 策略：复制源缩略图到 thumbnails/ + 在 works 数组最前插入新对象 + 验证

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
const indexPath = path.join(repoDir, 'index.html');
const thumbsDir = path.join(repoDir, 'thumbnails');

const srcThumb = 'C:\\Users\\HUAWEI\\.minimax\\v2\\assets\\2026\\08\\02\\08-06-15-994-asset_20260802-080615-994_8b04948a903a_cced6aaa-1000044399.jpg';
const newThumbName = '旅游_成都三圣花香随拍.jpg';
const destThumb = path.join(thumbsDir, newThumbName);

const newWork = {
  id: 150,
  title: '旅游_成都三圣花香随拍',
  url: 'https://weixin.qq.com/sph/ApmzUXwZrQ',
  thumbnail: 'thumbnails/' + newThumbName,
  description: '2023.9.7 成都三圣花香随拍纪念。',
  tags: ['江涵原创', '旅游', '视频'],
  medium: '视频',
  platform: '视频号',
  publishDate: '2026-08-02',
  status: '已发布',
};

console.log('=== 步骤 1: 复制缩略图到 thumbnails/ ===');
if (fs.existsSync(destThumb)) {
  console.log('  ⚠️ 已存在:', newThumbName, '— 跳过复制');
} else {
  fs.copyFileSync(srcThumb, destThumb);
  const stat = fs.statSync(destThumb);
  console.log(`  ✓ ${newThumbName} (${stat.size} 字节)`);
}

console.log('\n=== 步骤 2: 在 works 数组最前插入 id=150 ===');
let html = fs.readFileSync(indexPath, 'utf8');

// 找到 const works = [  后面
const worksStart = html.indexOf('const works = [');
if (worksStart < 0) {
  console.log('  ❌ 找不到 const works = [');
  process.exit(1);
}
const insertPos = worksStart + 'const works = ['.length;

// 检查是否已存在 id=150（防重）
const idCheck = new RegExp('"id"\\s*:\\s*150\\b');
if (idCheck.test(html)) {
  console.log('  ⚠️ id=150 已存在，跳过插入');
} else {
  // 构造新对象字符串
  const newObj = `\n      ${JSON.stringify(newWork, null, 2)
    .split('\n')
    .join('\n      ')},\n    `;
  html = html.substring(0, insertPos) + newObj + html.substring(insertPos);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('  ✓ id=150 已插入 works 数组最前');
}

console.log('\n=== 步骤 3: 验证 ===');
const newHtml = fs.readFileSync(indexPath, 'utf8');
const worksMatch = newHtml.match(/const works = (\[[\s\S]*?\]);/);
if (worksMatch) {
  const works = JSON.parse(worksMatch[1].replace(/,(\s*[}\]])/g, '$1'));
  console.log(`  works 总数: ${works.length}`);
  console.log(`  最大 id: ${Math.max(...works.map(w => w.id))}`);
  const w150 = works.find(w => w.id === 150);
  if (w150) {
    console.log(`  ✓ id=150: ${w150.title}`);
    console.log(`    thumb: ${w150.thumbnail}`);
  } else {
    console.log('  ❌ id=150 验证失败');
  }
}

console.log('\n=== 步骤 4: 缩略图大小确认 ===');
if (fs.existsSync(destThumb)) {
  const stat = fs.statSync(destThumb);
  console.log(`  ${newThumbName}: ${(stat.size / 1024).toFixed(1)} KB`);
}

console.log('\n=== 完成 ===');
console.log('接下来手动跑 git add + commit + push');
