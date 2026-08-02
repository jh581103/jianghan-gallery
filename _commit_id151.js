// id=151: 旅游_成都川剧院（1）：川剧研究院化妆间实拍
const fs = require('fs');
const path = require('path');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
const indexPath = path.join(repoDir, 'index.html');
const thumbsDir = path.join(repoDir, 'thumbnails');

const srcThumb = 'C:\\Users\\HUAWEI\\.minimax\\v2\\assets\\2026\\08\\02\\08-27-34-274-asset_20260802-082734-274_cacd2318dfb0_3e13f054-1000044403.jpg';
const newThumbName = '旅游_成都川剧院（1）：川剧研究院化妆间实拍.jpg';
const destThumb = path.join(thumbsDir, newThumbName);

const newWork = {
  id: 151,
  title: '旅游_成都川剧院（1）：川剧研究院化妆间实拍',
  url: 'https://weixin.qq.com/sph/A6SHbcqjIl',
  thumbnail: 'thumbnails/' + newThumbName,
  description: '2026.8.2 成都川剧院（1）川剧研究院化妆间实拍纪念。',
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

console.log('\n=== 步骤 2: 插入 id=151 ===');
let html = fs.readFileSync(indexPath, 'utf8');
const worksStart = html.indexOf('const works = [');
if (worksStart < 0) { console.log('❌ 找不到 works 数组'); process.exit(1); }
const insertPos = worksStart + 'const works = ['.length;
if (/"id"\s*:\s*151\b/.test(html)) {
  console.log('  ⚠️ id=151 已存在，跳过');
} else {
  const newObj = '\n      ' + JSON.stringify(newWork, null, 2).split('\n').join('\n      ') + ',\n    ';
  html = html.substring(0, insertPos) + newObj + html.substring(insertPos);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('  ✓ 已插入');
}

console.log('\n=== 步骤 3: 验证 ===');
const newHtml = fs.readFileSync(indexPath, 'utf8');
const m = newHtml.match(/const works = (\[[\s\S]*?\]);/);
const works = JSON.parse(m[1].replace(/,(\s*[}\]])/g, '$1'));
console.log(`  works 总数: ${works.length}, 最大 id: ${Math.max(...works.map(w => w.id))}`);
const w = works.find(x => x.id === 151);
if (w) {
  console.log(`  ✓ id=151: ${w.title}`);
  console.log(`    thumb: ${w.thumbnail}`);
  console.log(`    desc:  ${w.description}`);
}
