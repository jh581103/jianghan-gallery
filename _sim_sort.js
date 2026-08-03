// 模拟 sort 后的前几排
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// 提取 works 数组: 从 const works = 后面到 "\n    ]" 结束
const kw = html.indexOf('const works =');
const as = html.indexOf('[', kw);
const ae = html.indexOf('\n      ]\r\n    ;', as);
if (ae < 0) { console.log('❌ 找不到 works 数组结束'); process.exit(1); }
const arrText = html.substring(as, ae + '\n      ]'.length);
console.log('arrText 长度:', arrText.length);
console.log('前 80:', JSON.stringify(arrText.substring(0, 80)));
console.log('末 80:', JSON.stringify(arrText.substring(arrText.length - 80)));

const works = eval(arrText);
console.log('\nworks 数量:', works.length);

const sorted = [...works].sort((a, b) => {
  // 跟 index.html 里的 sort 函数保持一致
  const jieziRank = { 194: 190.7, 190: 190.5, 189: 190.3 };
  const aid = jieziRank[a.id] != null ? jieziRank[a.id] : (a.id || 0);
  const bid = jieziRank[b.id] != null ? jieziRank[b.id] : (b.id || 0);
  return bid - aid;
});

console.log('\n=== desc 排后 ===');
console.log('--- 第一排 (前 3) ---');
sorted.slice(0, 3).forEach(w => console.log('  id=' + w.id + ' ' + w.title.substring(0, 30)));
console.log('--- 第二排 (4-6) ---');
sorted.slice(3, 6).forEach(w => console.log('  id=' + w.id + ' ' + w.title.substring(0, 30)));
console.log('--- 第三排 (7-9) ---');
sorted.slice(6, 9).forEach(w => console.log('  id=' + w.id + ' ' + w.title.substring(0, 30)));
console.log('--- 第四排 (10-12) ---');
sorted.slice(9, 12).forEach(w => console.log('  id=' + w.id + ' ' + w.title.substring(0, 30)));

console.log('\n--- 街子系列位置 ---');
sorted.forEach((w, i) => {
  if ((w.title || '').includes('街子古镇') && (w.id || 0) < 200) {
    const row = Math.floor(i / 3) + 1;
    const col = (i % 3) + 1;
    console.log(`  id=${w.id} ${w.title.substring(0, 25)} -> 第 ${row} 排 第 ${col} 个`);
  }
});

// 验证 id=194 排在 191 之后
const idx191 = sorted.findIndex(w => w.id === 191);
const idx194 = sorted.findIndex(w => w.id === 194);
console.log(`\n  id=191 排第 ${idx191 + 1} 位`);
console.log(`  id=194 排第 ${idx194 + 1} 位`);
console.log(`  194 在 191 后面: ${idx191 < idx194}`);
