// id=194: 旅游_街子古镇（3）斯维登酒店外景实拍
// 决策: 插到 id=190 之后 (街子古镇系列 1-2-3 让 desc 排后 190, 194, 189 三卡相邻)
// 修复版: newObjText 末尾 = "        },\n    \n" (},\n+4空格+换行)，
//   拼上原本的 "      {id=191...}" = "        },\n    \n      {id=191...}" —— 有正确空行
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
const indexPath = path.join(repoDir, 'index.html');
const thumbsDir = path.join(repoDir, 'thumbnails');

const newThumbName = '旅游_街子古镇（3）斯维登酒店外景实拍.jpg';
const destThumb = path.join(thumbsDir, newThumbName);

// 末尾: "        },\n    \n" —— 9 字符 "        }," + 换行 + 4 空格 + 换行
// 拼上原本 "      {id=191...}" = "        },\n    \n      {id=191...}" —— 跟 id=190 后面格式完全一致
const newObjText =
  '      {\n' +
  '          "id": 194,\n' +
  '          "title": "旅游_街子古镇（3）斯维登酒店外景实拍",\n' +
  '          "url": "https://weixin.qq.com/sph/AoKpGxA0X4",\n' +
  '          "thumbnail": "thumbnails/旅游_街子古镇（3）斯维登酒店外景实拍.jpg",\n' +
  '          "description": "斯维登温泉酒店外景，从房间窗户向外俯瞰建筑群",\n' +
  '          "tags": [\n' +
  '            "江涵原创",\n' +
  '            "旅游",\n' +
  '            "视频"\n' +
  '          ],\n' +
  '          "medium": "视频",\n' +
  '          "platform": "视频号",\n' +
  '          "publishDate": "2026-08-03",\n' +
  '          "status": "已发布"\n' +
  '        },\n    \n';

console.log('=== 步骤 1: 缩略图 ===');
if (!fs.existsSync(destThumb)) { console.log('  ❌ 不存在'); process.exit(1); }
console.log(`  ✓ ${newThumbName} (${(fs.statSync(destThumb).size / 1024).toFixed(1)} KB)`);

console.log('\n=== 步骤 2: 插入 id=194 (插到 id=190 后面) ===');
let html = fs.readFileSync(indexPath, 'utf8');

// 定位 works 数组（避免误找 HTML head 里的 "id=194"）
const worksKw = html.indexOf('const works =');
const arrStart = html.indexOf('[', worksKw);
const arrEnd = html.indexOf('];', arrStart);
if (worksKw < 0 || arrStart < 0 || arrEnd < 0) {
  console.log('  ❌ 找不到 works 数组');
  process.exit(1);
}
console.log(`  works 数组范围: ${arrStart}..${arrEnd}`);

if (/"id"\s*:\s*194\b/.test(html.substring(arrStart, arrEnd))) {
  console.log('  ⚠️ id=194 已存在，删掉旧的');
  const id194Re = /\n        \},\n    \n      \{\n            "id": 194,/;
  // 简化为: 从 "id": 194 往前找到最近的 "      {" 开头, 往后找到 "        }," 结束
  const id194Pos = html.indexOf('"id": 194');
  // 往前找最近的 "      {" (6空格 + {)
  let start = html.lastIndexOf('      {', id194Pos);
  // 往后找第一个 "        }," (8空格 + },)
  let end = html.indexOf('        },', id194Pos);
  if (start < 0 || end < 0) { console.log('  ❌ 找不到 id=194 范围'); process.exit(1); }
  end += '        },'.length;
  // 还要删掉这个对象后面可能存在的空行 "\n    \n"
  // 简单做法: 删 start..end 之间
  console.log(`  删除范围: ${start}..${end} (${end-start} 字符)`);
  html = html.substring(0, start) + html.substring(end);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('  ✓ 已删');
  // 重新读
  html = fs.readFileSync(indexPath, 'utf8');
}

// 在 works 数组内找 id=190 的位置
const id190Re = /"id"\s*:\s*190\b/;
const m = id190Re.exec(html.substring(arrStart, arrEnd));
if (!m) { console.log('  ❌ works 数组内找不到 id=190'); process.exit(1); }
const id190Rel = m.index;
const id190Abs = arrStart + id190Rel;
console.log(`  id=190 绝对位置: ${id190Abs}`);

// 从 id=190 位置往后找对象结束 "},\n    \n"
const after190 = html.substring(id190Abs);
const endRe = /\},\r?\n    \r?\n/;
const endMatch = endRe.exec(after190);
if (!endMatch) { console.log('  ❌ id=190 后面找不到对象结束'); process.exit(1); }
// 插入点 = "},\n    \n" 结束之后（即原本 "      {id=191...}" 之前）
const insertPos = id190Abs + endMatch.index + endMatch[0].length;
console.log(`  插入点绝对位置: ${insertPos}`);

// 取出插入点前后的内容确认
const before = html.substring(Math.max(0, insertPos - 15), insertPos);
const after = html.substring(insertPos, Math.min(html.length, insertPos + 20));
console.log(`  插入点前 (最后 15 字): ${JSON.stringify(before)}`);
console.log(`  插入点后 (前 20 字): ${JSON.stringify(after)}`);

// newObjText 末尾 = "        },\n    \n" (有换行 + 4 空格 + 换行)
// 拼上原本的 "      {id=191...}" = "        },\n    \n      {id=191...}" —— 跟 id=190 后面格式完全一致
html = html.substring(0, insertPos) + newObjText + html.substring(insertPos);
fs.writeFileSync(indexPath, html, 'utf8');
console.log('  ✓ 已插入');

console.log('\n=== 步骤 3: syntax 验证 ===');
const tmpJs = path.join(repoDir, '_tmp_syntax_check.js');
const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];
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
const newHtml = fs.readFileSync(indexPath, 'utf8');
const newWorksKw = newHtml.indexOf('const works =');
const newArrStart = newHtml.indexOf('[', newWorksKw);
const newArrEnd = newHtml.indexOf('];', newArrStart);
const newArrText = newHtml.substring(newArrStart, newArrEnd);

const idCount = (newArrText.match(/"id"\s*:\s*194\b/g) || []).length;

const id190Pos = newArrText.indexOf('"id": 190');
const id191Pos = newArrText.indexOf('"id": 191');
const id189Pos = newArrText.indexOf('"id": 189');
const id194Pos = newArrText.indexOf('"id": 194');
console.log(`  id=189 位置: ${id189Pos}`);
console.log(`  id=190 位置: ${id190Pos}`);
console.log(`  id=194 位置: ${id194Pos}`);
console.log(`  id=191 位置: ${id191Pos}`);
console.log(`  位置正确 (id=190 < id=194 < id=189): ${id190Pos < id194Pos && id194Pos < id189Pos}`);
console.log(`  id=194 计数: ${idCount}`);

// 格式抽样: id=194 后面应该有空行 + 6 空格 + {  (跟 id=190 后面一致)
console.log('\n=== 步骤 5: 格式抽样 (id=194 结束 附近) ===');
const after194 = newHtml.substring(newHtml.indexOf('"id": 194') + 600, newHtml.indexOf('"id": 194') + 700);
// 找 "id": 194 后面最近的 "}," 结束位置
const id194End = newHtml.indexOf('"id": 194');
const objEnd = newHtml.indexOf('        },', id194End);
const next50 = newHtml.substring(objEnd, objEnd + 30);
console.log(`  id=194 结束位置: ${objEnd}`);
console.log(`  接下来 30 字: ${JSON.stringify(next50)}`);
console.log(`  期望: "        },\\n    \\n      {id=189"  (有 \\n    \\n 空行)`);
