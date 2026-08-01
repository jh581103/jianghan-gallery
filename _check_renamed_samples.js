const fs = require('fs');
const html = fs.readFileSync('D:\\AI工作空间\\项目\\江涵-gallery-github\\index.html', 'utf8');
const start = html.indexOf('const works =');
let depth = 0, end = -1;
for (let i = html.indexOf('[', start); i < html.length; i++) {
  if (html[i] === '[') depth++;
  else if (html[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
}
const works = JSON.parse(html.substring(html.indexOf('[', start), end + 1).replace(/,(\s*[}\]])/g, '$1'));

// 看已加序号的实际 title 格式
const renamed = works.filter(w => /（[1-9]|（[一二三四五六七八九十]+）/.test(w.title));
console.log('=== 已加序号的样本（前 30 个）===');
renamed.slice(0, 30).forEach(w => console.log(`  id=${w.id}: ${w.title}`));
console.log(`\n总加序号的: ${renamed.length}`);

// 按地点分组
const byPlace = {};
for (const w of renamed) {
  // 提取"（n）"前的内容作为地点
  const m = w.title.match(/^(.+?)（[1-9]|^(.+?)（[一二三四五六七八九十]+）/);
  if (m) {
    const place = (m[1] || m[2]).replace(/^旅游_/, '');
    if (!byPlace[place]) byPlace[place] = [];
    byPlace[place].push(w);
  }
}
console.log('\n=== 按地点分组 ===');
for (const [p, ws] of Object.entries(byPlace)) {
  console.log(`\n【${p}】(${ws.length} 个)`);
  ws.forEach(w => console.log(`  id=${w.id}: ${w.title}`));
}
