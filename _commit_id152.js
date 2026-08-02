// id=152: 旅游_成都川剧院（2）：川剧艺术中心外景实拍
const fs = require('fs');
const path = require('path');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
const indexPath = path.join(repoDir, 'index.html');
const thumbsDir = path.join(repoDir, 'thumbnails');

const srcThumb = 'C:\\Users\\HUAWEI\\.minimax\\v2\\assets\\2026\\08\\02\\08-53-24-659-asset_20260802-085324-659_8f456ffa71cd_2bd678db-1000044408.jpg';
const newThumbName = '旅游_成都川剧院（2）：川剧艺术中心外景实拍.jpg';
const destThumb = path.join(thumbsDir, newThumbName);

const newWork = {
  id: 152,
  title: '旅游_成都川剧院（2）：川剧艺术中心外景实拍',
  url: 'https://weixin.qq.com/sph/APGrbBPfoW',
  thumbnail: 'thumbnails/' + newThumbName,
  description: '成都川剧院（2）川剧艺术中心外景实拍纪念。',
  tags: ['江涵原创', '旅游', '视频'],
  medium: '视频',
  platform: '视频号',
  publishDate: '2026-08-02',
  status: '已发布',
};

console.log('=== 步骤 1: 复制缩略图 ===');
if (fs.existsSync(destThumb)) {
  console.log('  ⚠️ 已存在，跳过');
} else {
  fs.copyFileSync(srcThumb, destThumb);
  console.log(`  ✓ ${newThumbName} (${(fs.statSync(destThumb).size / 1024).toFixed(1)} KB)`);
}

console.log('\n=== 步骤 2: 插入 id=152 ===');
let html = fs.readFileSync(indexPath, 'utf8');
const worksKw = html.indexOf('const works =');
if (worksKw < 0) { console.log('❌ 找不到 const works'); process.exit(1); }
// 找 [ 出现的位置（可能在 const works = 后跟换行/空格）
const arrStart = html.indexOf('[', worksKw);
if (arrStart < 0) { console.log('❌ 找不到 ['); process.exit(1); }
const insertPos = arrStart + 1;
if (/"id"\s*:\s*152\b/.test(html)) {
  console.log('  ⚠️ id=152 已存在，跳过');
} else {
  const newObj = '\n      ' + JSON.stringify(newWork, null, 2).split('\n').join('\n      ') + ',\n    ';
  html = html.substring(0, insertPos) + newObj + html.substring(insertPos);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('  ✓ 已插入');
}

console.log('\n=== 步骤 3: 验证（用 Select-String 友好的方式）===');
const newHtml = fs.readFileSync(indexPath, 'utf8');
// 简单数 "id": 152
const idCount = (newHtml.match(/"id"\s*:\s*152\b/g) || []).length;
console.log(`  "id": 152 出现 ${idCount} 次`);
const newThumbCount = (newHtml.match(/thumbnails\/旅游_成都川剧院（2）：川剧艺术中心外景实拍\.jpg/g) || []).length;
console.log(`  thumb 字段出现 ${newThumbCount} 次`);
