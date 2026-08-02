// 扫所有旅游_XXX 标题，找出"同地点 ≥2 个但还没加序号"的组合
const fs = require('fs');
const html = fs.readFileSync('D:\\AI工作空间\\项目\\江涵-gallery-github\\index.html', 'utf8');
const start = html.indexOf('const works =');
let depth = 0, end = -1;
for (let i = html.indexOf('[', start); i < html.length; i++) {
  if (html[i] === '[') depth++;
  else if (html[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
}
const works = JSON.parse(html.substring(html.indexOf('[', start), end + 1).replace(/,(\s*[}\]])/g, '$1'));

// 提取所有旅游_ 标题
const travelWorks = works.filter(w => w.title.startsWith('旅游_'));

// 按"地点"分组
// 策略：去掉 "旅游_" 前缀，去掉序号 "（n）"，去掉冒号后的内容，去掉修饰词
function extractPlace(title) {
  let t = title.replace(/^旅游_/, '');
  // 去掉序号
  t = t.replace(/（[1-9]\)|（[一二三四五六七八九十]+）/g, '');
  // 去掉冒号后内容
  t = t.split(/[：:]/)[0];
  return t.trim();
}

const groups = {};
for (const w of travelWorks) {
  const place = extractPlace(w.title);
  if (!groups[place]) groups[place] = [];
  groups[place].push(w);
}

// 找出 ≥2 个的组，并检查是否都已加序号
console.log('=== 同地点 ≥2 个作品分组（按地点排序）===\n');
const sorted = Object.entries(groups).sort((a, b) => b[1].length - a[1].length);

let unrenamedCount = 0;
for (const [place, ws] of sorted) {
  if (ws.length < 2) continue;
  const renamed = ws.filter(w => /（[1-9]\)|（[一二三四五六七八九十]+）/.test(w.title));
  const unrenamed = ws.filter(w => !/（[1-9]\)|（[一二三四五六七八九十]+）/.test(w.title));
  if (unrenamed.length > 0) {
    unrenamedCount += unrenamed.length;
    console.log(`❌【${place}】(${ws.length} 个, 未加序号: ${unrenamed.length})`);
    ws.sort((a, b) => a.id - b.id).forEach(w => {
      const mark = /（[1-9]\)|（[一二三四五六七八九十]+）/.test(w.title) ? '✓' : '✗';
      console.log(`  ${mark} id=${w.id}: ${w.title}`);
    });
    console.log('');
  }
}

if (unrenamedCount === 0) {
  console.log('✅ 所有 ≥2 个同地点作品都已加序号');
} else {
  console.log(`\n⚠️ 还有 ${unrenamedCount} 个未加序号`);
}
