// 移动 id=194: 从 id=190 之后移到 id=189 之后 (让 1-2-3 连续显示)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
const indexPath = path.join(repoDir, 'index.html');

console.log('=== 步骤 1: 提取 id=194 对象 ===');
let html = fs.readFileSync(indexPath, 'utf8');

// 找 id=194 对象的开始位置 "id": 194
const id194Re = /"id"\s*:\s*194\b/;
const m194 = id194Re.exec(html);
if (!m194) { console.log('  ❌ 找不到 id=194'); process.exit(1); }
const id194Pos = m194.index;

// 找 id=194 对象的开始 "{": 往前找最近的 "\n      {"
const startSearch = html.lastIndexOf('\n      {', id194Pos);
if (startSearch < 0) { console.log('  ❌ 找不到 id=194 对象开始'); process.exit(1); }
const id194Start = startSearch + '\n      {'.length;  // 跳过 "\n      {"

// 找 id=194 对象的结束: 从 id194Start 往后找第一个 "\n        },\n"
const endSearch = html.indexOf('\n        },\n    \n      {', id194Start);
if (endSearch < 0) { console.log('  ❌ 找不到 id=194 对象结束'); process.exit(1); }
const id194End = endSearch + '\n        },\n    '.length;

const id194Obj = html.substring(startSearch, id194End);
console.log(`  ✓ id=194 对象位置: ${startSearch} - ${id194End} (${id194End - startSearch} chars)`);
console.log(`  预览: ${id194Obj.substring(0, 80)}...`);

console.log('\n=== 步骤 2: 删除旧位置 + 插到 id=189 之后 ===');
// 找 id=189 对象的结束位置
const id189Re = /"id"\s*:\s*189\b/;
const m189 = id189Re.exec(html);
if (!m189) { console.log('  ❌ 找不到 id=189'); process.exit(1); }
const id189Pos = m189.index;
const id189StartSearch = html.lastIndexOf('\n      {', id189Pos);
const id189Start = id189StartSearch + '\n      {'.length;
const id189EndSearch = html.indexOf('\n        },\n    \n      {', id189Start);
if (id189EndSearch < 0) { console.log('  ❌ 找不到 id=189 对象结束'); process.exit(1); }
const id189End = id189EndSearch + '\n        },\n    '.length;
console.log(`  id=189 对象结束位置: ${id189End}`);

// 从 html 删 id=194 对象（如果 startSearch < id189End，先删再插会改变 id189End 位置）
// 安全做法: 先插到 id=189 后面，再删 id=194 旧位置
// 但如果 id194Pos < id189End（不可能，因为 194 < 189 都比 189 早）...
// 实际 id=194 在 26414, id=189 结束在 26877+ — 194 在 189 之前（26414 < 26877）
// 所以先删 194 再插到 189 后面是安全的

let newHtml = html.substring(0, startSearch) + html.substring(id194End);
// 现在 id=189 位置可能变化（如果 id194End > id189End）
// 但 id194End = 26414 + ~600 chars = ~27000+, id189End = 26877 + ~600 chars = ~27400
// 所以 id194End > id189End，先删会改变 id189End 位置
// 重新算 id=189 在 newHtml 里的位置
const m189new = id189Re.exec(newHtml);
if (!m189new) { console.log('  ❌ 删后找不到 id=189'); process.exit(1); }
const id189PosNew = m189new.index;
const id189StartNew = newHtml.lastIndexOf('\n      {', id189PosNew) + '\n      {'.length;
const id189EndNewSearch = newHtml.indexOf('\n        },\n    \n      {', id189StartNew);
if (id189EndNewSearch < 0) { console.log('  ❌ 删后找不到 id=189 结束'); process.exit(1); }
const id189EndNew = id189EndNewSearch + '\n        },\n    '.length;

// 插到 id=189 之后
const insertPos = id189EndNew;
newHtml = newHtml.substring(0, insertPos) + '\n      ' + id194Obj.substring('\n      '.length) + newHtml.substring(insertPos);

console.log(`  ✓ id=194 已移到 id=189 之后 (新位置: ${insertPos})`);

fs.writeFileSync(indexPath, newHtml, 'utf8');

console.log('\n=== 步骤 3: syntax 验证 ===');
const tmpJs = path.join(repoDir, '_tmp_syntax_check.js');
const code = newHtml.match(/<script>([\s\S]*?)<\/script>/)[1];
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

console.log('\n=== 步骤 4: 验证 ===');
const finalHtml = fs.readFileSync(indexPath, 'utf8');
const id189PosF = finalHtml.indexOf('"id": 189');
const id190PosF = finalHtml.indexOf('"id": 190');
const id194PosF = finalHtml.indexOf('"id": 194');
console.log(`  id=189 位置: ${id189PosF}`);
console.log(`  id=190 位置: ${id190PosF}`);
console.log(`  id=194 位置: ${id194PosF}`);
console.log(`  顺序正确 (189 < 190 < 194): ${id189PosF < id190PosF && id190PosF < id194PosF}`);
const id194Count = (finalHtml.match(/"id":\s*194\b/g) || []).length;
console.log(`  id=194 总数: ${id194Count} (应为 1)`);
