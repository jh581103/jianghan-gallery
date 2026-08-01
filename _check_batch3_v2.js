// 宽松提取 id/title/thumbnail（兼容 workbuddy 和我录的两种格式）
const fs = require('fs');
const path = require('path');
const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';

const html = fs.readFileSync(path.join(repoDir, 'index.html'), 'utf8');

// 找 works 数组的起止（const works = [...]）
const worksStart = html.indexOf('const works =');
if (worksStart < 0) {
  console.log('❌ 找不到 const works');
  process.exit(1);
}
const arrayStart = html.indexOf('[', worksStart);
// 找配对的 ]：往前数 [ 和 ] 平衡
let depth = 0;
let arrayEnd = -1;
for (let i = arrayStart; i < html.length; i++) {
  if (html[i] === '[') depth++;
  else if (html[i] === ']') {
    depth--;
    if (depth === 0) { arrayEnd = i; break; }
  }
}
if (arrayEnd < 0) {
  console.log('❌ 找不到配对的 ]');
  process.exit(1);
}
var worksText = html.substring(arrayStart, arrayEnd + 1);

// 用 JSON.parse 直接解（移除尾部逗号）
// 先清洗：去掉对象之间非 JSON 的杂质
const cleanJson = worksText
  .replace(/,(\s*[}\]])/g, '$1') // 去掉尾随逗号
  .replace(/[\u0000-\u001F]/g, ''); // 去掉控制字符（不太可能出现）

let works;
try {
  works = JSON.parse(cleanJson);
} catch (e) {
  console.log('❌ JSON.parse 失败:', e.message);
  console.log('前 500 字:', cleanJson.substring(0, 500));
  process.exit(1);
}

const targets = [18, 54, 56, 57, 62, 63, 66, 68, 47, 48, 107, 108, 109, 113, 70, 111, 78, 79, 81, 82, 129, 131, 104];
const map = new Map();
for (const w of works) {
  if (targets.includes(w.id)) map.set(w.id, w);
}

const thumbsDir = path.join(repoDir, 'thumbnails');
const rootDir = repoDir;

console.log('=== id=104 bug 核对 ===');
const id104 = map.get(104);
if (id104) {
  console.log('当前 thumb:', id104.thumbnail);
  // 去掉 cache busting ?v=N
  const cleaned = id104.thumbnail.split('?')[0];
  const fullName = cleaned.replace(/^thumbnails\//, '');
  console.log('thumbs/ 试:', fs.existsSync(path.join(thumbsDir, fullName)));
  console.log('仓库根 试:', fs.existsSync(path.join(rootDir, fullName)));
}

console.log('\n=== 批 3 改名 22 个核对（按地点分组）===');
const groups = [
  { name: '元通古镇', ids: [18, 54] },
  { name: '新场古镇', ids: [56, 57] },
  { name: '街子古镇', ids: [62, 63] },
  { name: '江油太白碑林', ids: [66, 68] },
  { name: '广西南宁', ids: [47, 48] },
  { name: '成都金沙遗址博物馆', ids: [107, 108] },
  { name: '成都大慈寺', ids: [109, 113] },
  { name: '成都双子塔', ids: [70, 111] },
  { name: '青城山', ids: [78, 79] },
  { name: '花水湾', ids: [81, 82] },
  { name: '成都望丛祠', ids: [129, 131] },
];

for (const g of groups) {
  console.log(`\n【${g.name}】`);
  for (const id of g.ids) {
    const e = map.get(id);
    if (!e) { console.log(`  id=${id}: ❌ 没找到`); continue; }
    const cleaned = e.thumbnail.split('?')[0];
    const fullName = cleaned.replace(/^thumbnails\//, '');
    const inThumbs = fs.existsSync(path.join(thumbsDir, fullName));
    const inRoot = fs.existsSync(path.join(rootDir, fullName));
    const loc = inThumbs ? 'thumbnails/' : (inRoot ? '仓库根' : '❌');
    console.log(`  id=${id}\t[${loc}]\t${e.title}`);
  }
}

console.log(`\n=== 统计 ===`);
console.log(`works 总数: ${works.length}`);
console.log(`最大 id: ${Math.max(...works.map(w => w.id))}`);
