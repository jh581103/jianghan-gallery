// 看最近 5 个新作品的 thumb 格式
const fs = require('fs');
const html = fs.readFileSync('D:\\AI工作空间\\项目\\江涵-gallery-github\\index.html', 'utf8');
const start = html.indexOf('const works =');
let depth = 0, end = -1;
for (let i = html.indexOf('[', start); i < html.length; i++) {
  if (html[i] === '[') depth++;
  else if (html[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
}
const works = JSON.parse(html.substring(html.indexOf('[', start), end + 1).replace(/,(\s*[}\]])/g, '$1'));
// 按 id 降序，看前 5 个
const sorted = [...works].sort((a, b) => b.id - a.id);
console.log('=== 最近 5 个作品（id 降序）===');
for (const w of sorted.slice(0, 5)) {
  console.log(`id=${w.id} title=${w.title}`);
  console.log(`  thumb: ${w.thumbnail}`);
  console.log(`  full:`, JSON.stringify(w, null, 2).split('\n').slice(0, 12).join('\n'));
  console.log('');
}
