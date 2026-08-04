const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// 找到 script 块
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) { console.log('找不到 script 块'); process.exit(1); }
const scriptCode = scriptMatch[1];

// 在 scriptCode 里找 works 数组的完整范围
// 用 bracket 配对从 'const works =' 后第一个 '[' 开始配对
const kw = scriptCode.indexOf('const works =');
if (kw < 0) { console.log('找不到 const works ='); process.exit(1); }
const arrStart = scriptCode.indexOf('[', kw);
let depth = 0, arrEnd = -1;
for (let i = arrStart; i < scriptCode.length; i++) {
  const c = scriptCode[i];
  if (c === '[') depth++;
  else if (c === ']') { depth--; if (depth === 0) { arrEnd = i; break; } }
}
if (arrEnd < 0) { console.log('找不到 works 数组结束'); process.exit(1); }
const arrStr = scriptCode.slice(arrStart, arrEnd + 1);
let works;
try {
  works = eval(arrStr);
} catch (e) {
  console.log('eval 失败:', e.message);
  // 截取前 200 字
  console.log('arrStr 前 200:', arrStr.slice(0, 200));
  process.exit(1);
}
const ids = works.map(w => w.id).filter(x => typeof x === 'number');
const maxId = Math.max(...ids);
const total = works.length;
const todayCount = ids.filter(x => x >= 203 && x <= 210).length;
console.log('网站总作品数 works.length =', total);
console.log('最大 id 序号 =', maxId);
console.log('今天 (id=203-210) 成功上线 =', todayCount, '个');
const id210 = works.find(w => w.id === 210);
console.log('id=210 详情:', id210);
const sortedIds = ids.slice().sort((a, b) => a - b);
console.log('id 范围:', sortedIds[0], '-', sortedIds[sortedIds.length - 1]);
console.log('跳号数量:', sortedIds[sortedIds.length - 1] - sortedIds[0] + 1 - sortedIds.length);
