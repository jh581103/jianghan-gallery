// id=153: 旅游_汉中（1）：南湖天池雅居休闲旅实拍
const fs = require('fs');
const path = require('path');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
const indexPath = path.join(repoDir, 'index.html');
const thumbsDir = path.join(repoDir, 'thumbnails');

const srcThumb = 'C:\\Users\\HUAWEI\\.minimax\\v2\\assets\\2026\\08\\02\\09-17-07-175-asset_20260802-091707-175_d83cbcf6f8d2_144136ca-1000044414.jpg';
const newThumbName = '旅游_汉中（1）：南湖天池雅居休闲旅实拍.jpg';
const destThumb = path.join(thumbsDir, newThumbName);

const newWork = {
  id: 153,
  title: '旅游_汉中（1）：南湖天池雅居休闲旅实拍',
  url: 'https://weixin.qq.com/sph/AGUsoupz1E',
  thumbnail: 'thumbnails/' + newThumbName,
  description: '汉中（1）南湖天池雅居休闲旅实拍纪念。',
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

console.log('\n=== 步骤 2: 插入 id=153 ===');
let html = fs.readFileSync(indexPath, 'utf8');
const worksKw = html.indexOf('const works =');
if (worksKw < 0) { console.log('❌ 找不到 const works'); process.exit(1); }
const arrStart = html.indexOf('[', worksKw);
if (arrStart < 0) { console.log('❌ 找不到 ['); process.exit(1); }
const insertPos = arrStart + 1;
if (/"id"\s*:\s*153\b/.test(html)) {
  console.log('  ⚠️ id=153 已存在，跳过');
} else {
  const newObj = '\n      ' + JSON.stringify(newWork, null, 2).split('\n').join('\n      ') + ',\n    ';
  html = html.substring(0, insertPos) + newObj + html.substring(insertPos);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('  ✓ 已插入');
}

console.log('\n=== 步骤 3: 验证 ===');
const newHtml = fs.readFileSync(indexPath, 'utf8');
const idCount = (newHtml.match(/"id"\s*:\s*153\b/g) || []).length;
console.log(`  "id": 153 出现 ${idCount} 次`);
const titleCount = (newHtml.match(/旅游_汉中（1）：南湖天池雅居休闲旅实拍/g) || []).length;
console.log(`  title 出现 ${titleCount} 次（应该是 2：works + thumb）`);
