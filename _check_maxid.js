const fs = require('fs');
const html = fs.readFileSync('D:\\AI工作空间\\项目\\江涵-gallery-github\\index.html', 'utf8');
const start = html.indexOf('const works =');
let depth = 0, end = -1;
for (let i = html.indexOf('[', start); i < html.length; i++) {
  if (html[i] === '[') depth++;
  else if (html[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
}
const works = JSON.parse(html.substring(html.indexOf('[', start), end + 1).replace(/,(\s*[}\]])/g, '$1'));
console.log('最大 id:', Math.max(...works.map(w => w.id)));
console.log('总作品数:', works.length);
const id142 = works.find(w => w.id === 142);
console.log('id=142:', id142 ? id142.title : '不存在');
const id150 = works.find(w => w.id === 150);
console.log('id=150:', id150 ? id150.title : '不存在（可用）');
