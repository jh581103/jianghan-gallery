// 查找 works 数组真正的结尾结构
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join('D:\\AI工作空间\\项目\\江涵-gallery-github', '_cf_full.html'), 'utf8');
const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];

// 看 script 块的最后 500 字符
console.log('=== script 块最后 500 字符 ===');
console.log(code.substring(code.length - 500));

// 找 works 数组结尾位置（用 JSON 解析）
const worksKw = code.indexOf('const works =');
const arrStart = code.indexOf('[', worksKw);
let depth = 0, arrEnd = -1;
for (let i = arrStart; i < code.length; i++) {
  if (code[i] === '[') depth++;
  else if (code[i] === ']') { depth--; if (depth === 0) { arrEnd = i; break; } }
}
console.log('\nworks 数组 arrEnd =', arrEnd);
console.log('arrEnd 附近 100 字符:');
console.log(code.substring(arrEnd - 50, arrEnd + 50));
