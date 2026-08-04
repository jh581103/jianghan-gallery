const fs = require('fs');
const { execFileSync } = require('child_process');

const FILE = 'index.html';
const html = fs.readFileSync(FILE, 'utf8');

// 定位 works 数组
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

// 提取数组内容
const arrStr = html.slice(arrStart, arrEnd + 1);
let works;
try { works = eval(arrStr); }
catch (e) { console.log('eval works 失败:', e.message); process.exit(1); }

// 检查 id=211 是否已存在
if (works.find(w => w.id === 211)) {
  console.log('❌ id=211 已存在，不能重复添加');
  process.exit(1);
}

// 新作品对象
const newWork = {
  id: 211,
  title: '旅游_成都天府广场2：商业街区实拍',
  url: 'https://weixin.qq.com/sph/An50WzKuyP',
  thumbnail: 'thumbnails/旅游_成都天府广场2：商业街区实拍.jpg',
  description: '成都天府广场下沉商业街区，金色螺旋雕塑非常显眼。',
  tags: ['江涵原创', '旅游', '视频'],
  medium: '视频',
  platform: '视频号',
  publishDate: '2026-08-04',
  status: '已发布'
};

works.push(newWork);

// 重新序列化
const newArrStr = JSON.stringify(works, null, 2);
// 原始缩进 = 6 空格（看之前的格式）
const indent = '      ';
const newArrStrIndented = newArrStr.split('\n').map((line, i) => {
  if (i === 0) return indent + line;
  return indent + line;
}).join('\n');

// 替换原数组
const before = html.slice(0, arrStart);
const after = html.slice(arrEnd + 1);
const newHtml = before + newArrStrIndented + after;

fs.writeFileSync(FILE, newHtml);
console.log('✓ index.html 已写入新作品 id=211');

// 验证 syntax
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

// 再次读取 + 确认 id=211 真的写进去了
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
const w211 = works2.find(w => w.id === 211);
if (!w211) { console.log('❌ 验证失败：id=211 未找到'); process.exit(1); }
console.log('✓ 验证：id=211 已写入：', JSON.stringify(w211, null, 2));
console.log('当前 works.length =', works2.length);
