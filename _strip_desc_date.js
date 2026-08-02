// 删 id=150, 151 简介里的日期
const fs = require('fs');
const path = require('path');
const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
const indexPath = path.join(repoDir, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');
const start = html.indexOf('const works =');
let depth = 0, end = -1;
for (let i = html.indexOf('[', start); i < html.length; i++) {
  if (html[i] === '[') depth++;
  else if (html[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
}
const worksText = html.substring(html.indexOf('[', start), end + 1);
const works = JSON.parse(worksText.replace(/,(\s*[}\]])/g, '$1'));

// 删 description 开头的日期（如 "2023.9.7 " / "2026.8.2 "）
const dateRe = /^\d{4}\.\d{1,2}\.\d{1,2}\s+/;
const targets = [150, 151];
const changes = [];

for (const id of targets) {
  const w = works.find(x => x.id === id);
  if (!w) continue;
  const m = w.description.match(dateRe);
  if (!m) {
    console.log(`id=${id} 简介里没日期，跳过`);
    continue;
  }
  const newDesc = w.description.replace(dateRe, '');
  changes.push({ id, old: w.description, neu: newDesc });
  w.description = newDesc;
}

if (changes.length === 0) {
  console.log('无需修改');
  process.exit(0);
}

// 重新序列化 + 写回
const newWorksText = JSON.stringify(works, null, 2)
  .split('\n')
  .map((line, i) => i === 0 ? line : '    ' + line)
  .join('\n');
// 实际是直接构造
const newWorksArrText = '\n      ' + JSON.stringify(works, null, 2)
  .split('\n')
  .join('\n      ') + ',\n    ';

html = html.replace(worksText + ';', newWorksArrText + ';');
fs.writeFileSync(indexPath, html, 'utf8');

console.log('=== 修改 ===');
for (const c of changes) {
  console.log(`id=${c.id}:`);
  console.log(`  旧: ${c.old}`);
  console.log(`  新: ${c.neu}`);
}

console.log('\n=== 验证 ===');
const newHtml = fs.readFileSync(indexPath, 'utf8');
const newMatch = newHtml.match(/const works = (\[[\s\S]*?\]);/);
const newWorks = JSON.parse(newMatch[1].replace(/,(\s*[}\]])/g, '$1'));
for (const c of changes) {
  const w = newWorks.find(x => x.id === c.id);
  console.log(`  id=${c.id}: ${w.description}`);
}
