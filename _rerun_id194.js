// 重新录 id=194 到 id=189 之后 (手写 newWork, 不用 eval)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
const indexPath = path.join(repoDir, 'index.html');
const thumbsDir = path.join(repoDir, 'thumbnails');

const newThumbName = '旅游_街子古镇（3）斯维登酒店外景实拍.jpg';
const destThumb = path.join(thumbsDir, newThumbName);

const newWork = {
  id: 194,
  title: '旅游_街子古镇（3）斯维登酒店外景实拍',
  url: 'https://weixin.qq.com/sph/AoKpGxA0X4',
  thumbnail: 'thumbnails/' + newThumbName,
  description: '斯维登温泉酒店外景，从房间窗户向外俯瞰建筑群',
  tags: ['江涵原创', '旅游', '视频'],
  medium: '视频',
  platform: '视频号',
  publishDate: '2026-08-03',
  status: '已发布',
};

console.log('=== 步骤 1: 检查缩略图 ===');
if (!fs.existsSync(destThumb)) { console.log('  ❌ 缩略图不存在'); process.exit(1); }
console.log(`  ✓ ${newThumbName} (${(fs.statSync(destThumb).size / 1024).toFixed(1)} KB)`);

console.log('\n=== 步骤 2: 找 works 数组起始位置 ===');
let html = fs.readFileSync(indexPath, 'utf8');
const worksKw = html.indexOf('const works =');
const arrStart = html.indexOf('[', worksKw);
console.log(`  const works = at ${worksKw}, [ at ${arrStart}`);

console.log('\n=== 步骤 3: 检查 works 数组里 id=194 ===');
// 只在 works 数组里找 id=194 (不要找 HTML head 里的)
const re = /"id":\s*(\d+)/g;
let m;
let id194PosInWorks = -1;
while ((m = re.exec(html)) !== null) {
  if (m.index > arrStart && parseInt(m[1]) === 194) {
    id194PosInWorks = m.index;
    break;
  }
}
if (id194PosInWorks > 0) {
  console.log(`  ⚠️ works 数组里已有 id=194 at ${id194PosInWorks}, 先删`);
  const startSearch = html.lastIndexOf('\n      {', id194PosInWorks);
  const start = startSearch + '\n      {'.length;
  const endSearch = html.indexOf('\n        },\n    \n      {', start);
  if (endSearch < 0) { console.log('  ❌ 找不到 id=194 对象结束'); process.exit(1); }
  const end = endSearch + '\n        },\n    '.length;
  html = html.substring(0, startSearch) + html.substring(end);
  console.log(`  ✓ 已删 (${startSearch} - ${end})`);
} else {
  console.log('  ✓ works 数组里没有 id=194');
}

console.log('\n=== 步骤 4: 找 id=189 位置（在 works 数组里）===');
let id189Pos = -1;
re.lastIndex = 0;
while ((m = re.exec(html)) !== null) {
  if (m.index > arrStart && parseInt(m[1]) === 189) {
    id189Pos = m.index;
    break;
  }
}
if (id189Pos < 0) { console.log('  ❌ 找不到 id=189'); process.exit(1); }
const id189Start = html.lastIndexOf('\n      {', id189Pos) + '\n      {'.length;
const id189EndSearch = html.indexOf('\n        },\n    \n      {', id189Start);
if (id189EndSearch < 0) { console.log('  ❌ 找不到 id=189 对象结束'); process.exit(1); }
const id189End = id189EndSearch + '\n        },\n    '.length;
console.log(`  id=189 结束位置: ${id189End}`);

console.log('\n=== 步骤 5: 插到 id=189 之后 ===');
const newObj = '\n      ' + JSON.stringify(newWork, null, 2)
  .split('\n')
  .map((line, i) => i === 0 ? line : '        ' + line)
  .join('\n') + ',\n    ';
html = html.substring(0, id189End) + newObj + html.substring(id189End);
fs.writeFileSync(indexPath, html, 'utf8');
console.log('  ✓ id=194 已插入到 id=189 之后');

console.log('\n=== 步骤 6: syntax 验证 ===');
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

console.log('\n=== 步骤 7: 验证 (works 数组里) ===');
const finalHtml = fs.readFileSync(indexPath, 'utf8');
// 重新找 works 起始
const worksKw2 = finalHtml.indexOf('const works =');
const arrStart2 = finalHtml.indexOf('[', worksKw2);
const re2 = /"id":\s*(\d+)/g;
const ids = [];
let m2;
while ((m2 = re2.exec(finalHtml)) !== null) {
  if (m2.index > arrStart2) ids.push({id: parseInt(m2[1]), pos: m2.index});
}
const id189F = ids.find(p => p.id === 189);
const id190F = ids.find(p => p.id === 190);
const id194F = ids.find(p => p.id === 194);
console.log(`  id=189 位置: ${id189F?.pos}`);
console.log(`  id=190 位置: ${id190F?.pos}`);
console.log(`  id=194 位置: ${id194F?.pos}`);
console.log(`  顺序正确 (189 < 190 < 194): ${id189F && id190F && id194F && id189F.pos < id190F.pos && id190F.pos < id194F.pos}`);
const id194Count = ids.filter(p => p.id === 194).length;
console.log(`  id=194 在 works 数组里总数: ${id194Count} (应为 1)`);
// 看 id=194 周围 5 个
const idx194 = ids.findIndex(p => p.id === 194);
console.log('  id=194 前后:');
ids.slice(Math.max(0, idx194 - 3), idx194 + 4).forEach(p => console.log('    id=' + p.id + ' at ' + p.pos));
