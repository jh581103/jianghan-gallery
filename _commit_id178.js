// id=178: 旅游_成都国庆（7）：锦江廊桥夜景
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
const indexPath = path.join(repoDir, 'index.html');
const thumbsDir = path.join(repoDir, 'thumbnails');

const srcThumb = 'C:\\Users\\HUAWEI\\.minimax\\v2\\assets\\2026\\08\\02\\20-07-15-226-asset_20260802-200715-226_78fe707cf125_2200e933-1000044550.jpg';
const newThumbName = '旅游_成都国庆（7）：锦江廊桥夜景.jpg';
const destThumb = path.join(thumbsDir, newThumbName);

const newWork = {
  id: 178,
  title: '旅游_成都国庆（7）：锦江廊桥夜景',
  url: 'https://weixin.qq.com/sph/AXO7UdiNEJ',
  thumbnail: 'thumbnails/' + newThumbName,
  description: '成都锦江廊桥国庆夜，灯火璀璨',
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

console.log('\n=== 步骤 2: 插入 id=178 ===');
let html = fs.readFileSync(indexPath, 'utf8');
const worksKw = html.indexOf('const works =');
if (worksKw < 0) { console.log('❌ 找不到 const works'); process.exit(1); }
const arrStart = html.indexOf('[', worksKw);
if (arrStart < 0) { console.log('❌ 找不到 ['); process.exit(1); }
const insertPos = arrStart + 1;
if (/"id"\s*:\s*178\b/.test(html)) {
  console.log('  ⚠️ id=178 已存在，跳过');
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
  console.log('  ✓ script 块 syntax OK');
} catch (e) {
  console.log('  ❌ script 块 syntax 错:');
  console.log('    ' + e.stderr.toString().split('\n').slice(0, 5).join('\n    '));
  fs.unlinkSync(tmpJs);
  process.exit(1);
}
fs.unlinkSync(tmpJs);

console.log('\n=== 步骤 4: 验证 ===');
const newHtml = fs.readFileSync(indexPath, 'utf8');
const idCount = (newHtml.match(/"id"\s*:\s*178\b/g) || []).length;
const titleCount = (newHtml.match(/旅游_成都国庆（7）：锦江廊桥夜景/g) || []).length;
console.log(`  "id": 178 出现 ${idCount} 次`);
console.log(`  title 出现 ${titleCount} 次`);
