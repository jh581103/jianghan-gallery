const fs = require('fs');
const html = fs.readFileSync('D:\\AI工作空间\\项目\\江涵-gallery-github\\index.html', 'utf8');
const m = html.indexOf('const works =');
let depth = 0, end = -1;
for (let i = html.indexOf('[', m); i < html.length; i++) {
  if (html[i] === '[') depth++;
  else if (html[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
}
const worksText = html.substring(html.indexOf('[', m), end + 1);
const works = JSON.parse(worksText.replace(/,(\s*[}\]])/g, '$1'));
console.log('=== 本地 index.html 状态 ===');
console.log('works 数:', works.length);
console.log('最大 id:', Math.max(...works.map(w => w.id)));
console.log('works 数组总字符数:', worksText.length);
console.log('');
const ids = works.map(w => w.id).sort((a, b) => a - b);
console.log('id 范围:', ids[0], '-', ids[ids.length - 1]);
console.log('前 5 个 id:', ids.slice(0, 5));
console.log('后 5 个 id:', ids.slice(-5));
let gaps = [];
for (let i = 1; i < ids.length; i++) {
  if (ids[i] - ids[i-1] > 1) gaps.push([ids[i-1], ids[i]]);
}
console.log('跳号区间:', gaps.slice(0, 10));
