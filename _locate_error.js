// 定位 _cf_full.html 里 script 块的语法错误位置
const fs = require('fs');
const html = fs.readFileSync('D:\\AI工作空间\\项目\\江涵-gallery-github\\_cf_full.html', 'utf8');

// 找主 script 块
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) { console.log('no script'); process.exit(1); }
const code = scriptMatch[1];
console.log('script 块字符数:', code.length);

// 找 works 数组结束位置
const worksEnd = code.indexOf(']\n    ;');
console.log('works 数组结束位置: worksEnd =', worksEnd);

if (worksEnd > 0) {
  // 显示结束位置前后 200 字符
  const start = Math.max(0, worksEnd - 200);
  const end = Math.min(code.length, worksEnd + 200);
  console.log('=== 错误位置附近 ===');
  console.log(code.substring(start, end));
  console.log('=== END ===');
}

// 看完整 works 数组尾部（从 id=153 往前数 5 个 + 数组结尾）
const tail = code.substring(worksEnd - 2000, worksEnd + 200);
console.log('=== works 数组尾部 ===');
console.log(tail);
console.log('=== END ===');
