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

// 1) 改 id=214 作品名 + thumbnail 字段（去"1"）
const w214 = works.find(w => w.id === 214);
if (!w214) { console.log('❌ id=214 不存在'); process.exit(1); }
const oldTitle214 = w214.title;
const oldThumb214 = w214.thumbnail;
w214.title = '旅游_茅屋渔家：青城山茅屋渔家实拍';
w214.thumbnail = 'thumbnails/旅游_茅屋渔家：青城山茅屋渔家实拍.jpg';
console.log('✓ id=214 title: "' + oldTitle214 + '" -> "' + w214.title + '"');
console.log('✓ id=214 thumbnail: "' + oldThumb214 + '" -> "' + w214.thumbnail + '"');

// 2) 加 id=215
if (works.find(w => w.id === 215)) { console.log('❌ id=215 已存在'); process.exit(1); }
const newWork = {
  id: 215,
  title: '旅游_普照寺1：都江堰普照寺实拍',
  url: 'https://weixin.qq.com/sph/AwT8hXw2gg',
  thumbnail: 'thumbnails/旅游_普照寺1：都江堰普照寺实拍.jpg',
  description: '都江堰普照寺，四川省文物保护单位。',
  tags: ['江涵原创', '旅游', '视频'],
  medium: '视频',
  platform: '视频号',
  publishDate: '2026-08-04',
  status: '已发布'
};
works.push(newWork);
console.log('✓ id=215 已加');

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
console.log('✓ index.html 已写入');

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
const w214v = works2.find(w => w.id === 214);
const w215v = works2.find(w => w.id === 215);
if (!w214v) { console.log('❌ 验证失败：id=214 未找到'); process.exit(1); }
if (!w215v) { console.log('❌ 验证失败：id=215 未找到'); process.exit(1); }
console.log('✓ id=214 验证:', JSON.stringify(w214v, null, 2));
console.log('✓ id=215 验证:', JSON.stringify(w215v, null, 2));
console.log('当前 works.length =', works2.length);
