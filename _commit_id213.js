const fs = require('fs');
const { execFileSync } = require('child_process');

const FILE = 'index.html';
const html = fs.readFileSync(FILE, 'utf8');

const kw = html.indexOf('const works =');
if (kw < 0) { console.log('找不到 const works ='); process.exit(1); }
const arrStart = html.indexOf('[', kw);
let depth = 0, arrEnd = -1;
for (let i = arrStart; i < html.length; i++) {
  const c = html[i];
  if (c === '[') depth++;
  else if (c === ']') { depth--; if (depth === 0) { arrEnd = i; break; } }
}
if (arrEnd < 0) { console.log('找不到 ]'); process.exit(1); }

const arrStr = html.slice(arrStart, arrEnd + 1);
let works;
try { works = eval(arrStr); }
catch (e) { console.log('eval works 失败:', e.message); process.exit(1); }

if (works.find(w => w.id === 213)) {
  console.log('❌ id=213 已存在');
  process.exit(1);
}

// 江涵特例：明确给了 section=历史 + tags=[历史,中国,读后感]
// section/subSection 字段需要单值，先按"中国"录（江涵给的第一个）
// tags 数组完全照写 + 江涵原创
const newWork = {
  id: 213,
  title: '《透过地理看历史》第一章 读后感',
  url: 'https://weixin.qq.com/sph/AC2DlVnuis',
  thumbnail: 'thumbnails/《透过地理看历史》第一章 读后感.jpg',
  description: '从地理角度读历史，古代中国的九州划分清晰明了。',
  tags: ['江涵原创', '历史', '中国', '读后感'],
  medium: '视频',
  platform: '视频号',
  publishDate: '2026-08-04',
  status: '已发布',
  section: '历史',
  subSection: '中国'
};

works.push(newWork);

const newArrStr = JSON.stringify(works, null, 2);
const indent = '      ';
const newArrStrIndented = newArrStr.split('\n').map((line, i) => {
  if (i === 0) return indent + line;
  return indent + line;
}).join('\n');

const before = html.slice(0, arrStart);
const after = html.slice(arrEnd + 1);
const newHtml = before + newArrStrIndented + after;

fs.writeFileSync(FILE, newHtml);
console.log('✓ index.html 已写入新作品 id=213');

const scriptMatch = newHtml.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) { console.log('❌ 找不到 script 块'); process.exit(1); }
const tmp = '_tmp_check.js';
fs.writeFileSync(tmp, scriptMatch[1]);
try {
  execFileSync('node', ['--check', tmp], { stdio: 'pipe' });
  console.log('✓ syntax OK');
} catch (e) {
  console.log('❌ syntax 错:', e.stderr.toString());
  fs.unlinkSync(tmp);
  process.exit(1);
}
fs.unlinkSync(tmp);

const verify = fs.readFileSync(FILE, 'utf8');
const kw2 = verify.indexOf('const works =');
const arrStart2 = verify.indexOf('[', kw2);
let depth2 = 0, arrEnd2 = -1;
for (let i = arrStart2; i < verify.length; i++) {
  const c = verify[i];
  if (c === '[') depth2++;
  else if (c === ']') { depth2--; if (depth2 === 0) { arrEnd2 = i; break; } }
}
const works2 = eval(verify.slice(arrStart2, arrEnd2 + 1));
const w213 = works2.find(w => w.id === 213);
if (!w213) { console.log('❌ 验证失败：id=213 未找到'); process.exit(1); }
console.log('✓ 验证：id=213 已写入：', JSON.stringify(w213, null, 2));
console.log('当前 works.length =', works2.length);
