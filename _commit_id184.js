// id=184: 旅游_ 四川博物馆（4）：清代象牙雕
// 注意: title 用"旅游_ 四川"（下划线后多一个空格），跟 id=181-183 不一致
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
const indexPath = path.join(repoDir, 'index.html');
const thumbsDir = path.join(repoDir, 'thumbnails');

const newThumbName = '旅游_ 四川博物馆（4）：清代象牙雕.jpg';
const destThumb = path.join(thumbsDir, newThumbName);

const newWork = {
  id: 184,
  title: '旅游_ 四川博物馆（4）：清代象牙雕',
  url: 'https://weixin.qq.com/sph/ATXCYwgn7d',
  thumbnail: 'thumbnails/' + newThumbName,
  description: '清代象牙雕仕女图，雕工精细',
  tags: ['江涵原创', '旅游', '视频'],
  medium: '视频',
  platform: '视频号',
  publishDate: '2026-08-02',
  status: '已发布',
};

console.log('=== 步骤 1: 缩略图 ===');
if (!fs.existsSync(destThumb)) { console.log('  ❌ 不存在'); process.exit(1); }
console.log(`  ✓ ${newThumbName} (${(fs.statSync(destThumb).size / 1024).toFixed(1)} KB)`);

console.log('\n=== 步骤 2: 插入 id=184 ===');
let html = fs.readFileSync(indexPath, 'utf8');
const worksKw = html.indexOf('const works =');
const arrStart = html.indexOf('[', worksKw);
const insertPos = arrStart + 1;
if (/"id"\s*:\s*184\b/.test(html)) {
  console.log('  ⚠️ id=184 已存在，跳过');
} else {
  const newObj = '\n      ' + JSON.stringify(newWork, null, 2)
    .split('\n')
    .map((line, i) => i === 0 ? line : '        ' + line)
    .join('\n') + ',\n    ';
  html = html.substring(0, insertPos) + newObj + html.substring(insertPos);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('  ✓ 已插入');
}

console.log('\n=== 步骤 3: syntax 验证 ===');
const tmpJs = path.join(repoDir, '_tmp_syntax_check.js');
const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];
fs.writeFileSync(tmpJs, code, 'utf8');
try {
  execFileSync('node', ['--check', tmpJs], { stdio: 'pipe' });
  console.log('  ✓ syntax OK');
  fs.unlinkSync(tmpJs);
} catch (e) {
  console.log('  ❌ syntax 错:');
  console.log('    ' + e.stderr.toString().split('\n').slice(0, 5).join('\n    '));
  fs.unlinkSync(tmpJs);
  process.exit(1);
}

console.log('\n=== 步骤 4: 验证 ===');
const newHtml = fs.readFileSync(indexPath, 'utf8');
const idCount = (newHtml.match(/"id"\s*:\s*184\b/g) || []).length;
const titleCount = (newHtml.match(/旅游_ 四川博物馆（4）：清代象牙雕/g) || []).length;
console.log(`  id=184: ${idCount}, title: ${titleCount}`);
