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

if (works.find(w => w.id === 214)) {
  console.log('❌ id=214 已存在');
  process.exit(1);
}

// 旅游类简化模板（参照 id=210）：不加 section/subSection，只用 tags 分类
const newWork = {
  id: 214,
  title: '旅游_茅屋渔家1：青城山茅屋渔家实拍',
  url: 'https://weixin.qq.com/sph/AMKAfKq3tN',
  thumbnail: 'thumbnails/旅游_茅屋渔家1：青城山茅屋渔家实拍.jpg',
  description: '青城山下的茅屋渔家，池塘边喝茶的好地方。',
  tags: ['江涵原创', '旅游', '视频'],
  medium: '视频',
  platform: '视频号',
  publishDate: '2026-08-04',
  status: '已发布'
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
console.log('✓ index.html 已写入新作品 id=214');

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
const w214 = works2.find(w => w.id === 214);
if (!w214) { console.log('❌ 验证失败：id=214 未找到'); process.exit(1); }
console.log('✓ 验证：id=214 已写入：', JSON.stringify(w214, null, 2));
console.log('当前 works.length =', works2.length);
