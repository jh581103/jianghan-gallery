// 核对批 3 特殊情况：中文引号、同名冲突
const fs = require('fs');
const path = require('path');
const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';

console.log('=== 1. id=66, 68, 70 中文引号核对 ===');
for (const id of [66, 68, 70]) {
  console.log(`\nid=${id}:`);
  // 仓库根
  const rootMatch1 = fs.readdirSync(repoDir).filter(f => f.includes('太白碑林') || f.includes('双子塔'));
  for (const f of rootMatch1) {
    // 打印每个字符的 code point
    const codes = [...f].map(c => 'U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')).join(' ');
    console.log(`  仓库根: ${f}`);
    console.log(`         ${codes}`);
  }
}

console.log('\n=== 2. id=18 vs id=54 元通古镇 同名冲突 ===');
const rootYuantong = fs.readdirSync(repoDir).filter(f => f.includes('元通'));
for (const f of rootYuantong) {
  const codes = [...f].map(c => 'U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')).join(' ');
  console.log(`  仓库根: ${f}`);
  console.log(`          ${codes}`);
}

console.log('\n=== 3. 仓库根 + thumbnails/ 总览（旅游_XXX）===');
const rootTravel = fs.readdirSync(repoDir).filter(f => f.startsWith('旅游_'));
const thumbsTravel = fs.existsSync(path.join(repoDir, 'thumbnails')) ?
  fs.readdirSync(path.join(repoDir, 'thumbnails')).filter(f => f.startsWith('旅游_')) : [];
console.log(`仓库根 旅游_XXX: ${rootTravel.length} 个`);
console.log(`thumbnails/ 旅游_XXX: ${thumbsTravel.length} 个`);
