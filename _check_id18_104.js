const fs = require('fs');
const path = require('path');
const html = fs.readFileSync('D:\\AI工作空间\\项目\\江涵-gallery-github\\index.html', 'utf8');
const start = html.indexOf('const works =');
let depth = 0, end = -1;
for (let i = html.indexOf('[', start); i < html.length; i++) {
  if (html[i] === '[') depth++;
  else if (html[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
}
const works = JSON.parse(html.substring(html.indexOf('[', start), end + 1).replace(/,(\s*[}\]])/g, '$1'));

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';

// 详细看 id=18, 54, 66, 68, 78, 79, 81, 82, 70, 111, 104
const watchIds = [18, 54, 66, 68, 78, 79, 81, 82, 70, 111, 104];
for (const id of watchIds) {
  const w = works.find(x => x.id === id);
  if (!w) continue;
  const cleaned = w.thumbnail.split('?')[0];
  const fullName = cleaned.replace(/^thumbnails\//, '');
  const inThumbs = fs.existsSync(path.join(repoDir, 'thumbnails', fullName));
  const inRoot = fs.existsSync(path.join(repoDir, fullName));
  console.log(`\nid=${id}`);
  console.log(`  title: ${w.title}`);
  console.log(`  thumb: ${w.thumbnail}`);
  console.log(`  desc:  ${w.description}`);
  console.log(`  实际位置: ${inThumbs ? 'thumbnails/' : ''}${inRoot ? '仓库根' : ''}${!inThumbs && !inRoot ? '❌' : ''}`);
}
