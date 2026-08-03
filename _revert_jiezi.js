// 清理 sort 函数前面的老注释
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
const indexPath = path.join(repoDir, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// 找注释开始 + sort 函数结束
const commentStart = html.indexOf('// 按录入时间倒序排列');
if (commentStart < 0) { console.log('❌ 找不到注释开始'); process.exit(1); }
const sortEnd = html.indexOf("});", commentStart);
if (sortEnd < 0) { console.log('❌ 找不到 sort 函数结束'); process.exit(1); }
const sortEndReal = sortEnd + 3;  // 包含 });

// 找到 sort 函数前的换行（注释前的空行）
let blockStart = commentStart;
while (blockStart > 0 && (html[blockStart-1] === ' ' || html[blockStart-1] === '\t')) {
  blockStart--;
}
// 也跳过前面的换行
if (blockStart > 0 && html[blockStart-1] === '\n') {
  blockStart--;
  // 跳过前导空白行
  while (blockStart > 0 && (html[blockStart-1] === '\n' || html[blockStart-1] === '\r')) {
    blockStart--;
  }
}

console.log('老 block 范围:', blockStart, '..', sortEndReal);
console.log('老 block 长度:', sortEndReal - blockStart);
console.log('老 block 内容:');
console.log(html.substring(blockStart, sortEndReal));
console.log('---');

const newBlock = `      // 按录入时间倒序排列（id 大 = 最新录入，排最上最左）
      // 系列连续: 靠 title 里的"（1）（2）..."序号标注, 不再加 jieziRank (避免数据被改)
      filtered.sort(function(a, b) {
        return (b.id || 0) - (a.id || 0);
      });`;

html = html.substring(0, blockStart) + newBlock + html.substring(sortEndReal);
fs.writeFileSync(indexPath, html, 'utf8');
console.log('✓ 已替换');

const newHtml = fs.readFileSync(indexPath, 'utf8');
const r1 = (newHtml.match(/jieziRank/g) || []).length;
const r2 = (newHtml.match(/xiongmaoRank/g) || []).length;
const r3 = (newHtml.match(/getRank/g) || []).length;
console.log('替换后 - jieziRank:', r1, 'xiongmaoRank:', r2, 'getRank:', r3);

console.log('\n=== syntax 验证 ===');
const code = newHtml.match(/<script>([\s\S]*?)<\/script>/)[1];
const tmpJs = path.join(repoDir, '_tmp_check.js');
fs.writeFileSync(tmpJs, code, 'utf8');
try {
  execFileSync('node', ['--check', tmpJs], { stdio: 'pipe' });
  console.log('  ✓ syntax OK');
  fs.unlinkSync(tmpJs);
} catch (e) {
  console.log('  ❌ syntax 错:');
  console.log('    ' + e.stderr.toString().split('\n').slice(0, 5).join('\n    '));
  fs.unlinkSync(tmpJs);
  process.exit(1);
}
