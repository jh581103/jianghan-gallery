// id=194: 旅游_街子古镇（3）斯维登酒店外景实拍
// 特例: 插到 id=190 后面（"街子古镇"系列内），不是最前面
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
const indexPath = path.join(repoDir, 'index.html');
const thumbsDir = path.join(repoDir, 'thumbnails');

const newThumbName = '旅游_街子古镇（3）斯维登酒店外景实拍.jpg';
const destThumb = path.join(thumbsDir, newThumbName);

const newWork = {
  id: 194,
  title: '旅游_街子古镇（3）斯维登酒店外景实拍',
  url: 'https://weixin.qq.com/sph/AoKpGxA0X4',
  thumbnail: 'thumbnails/' + newThumbName,
  description: '斯维登温泉酒店外景，从房间窗户向外俯瞰建筑群',
  tags: ['江涵原创', '旅游', '视频'],
  medium: '视频',
  platform: '视频号',
  publishDate: '2026-08-03',
  status: '已发布',
};

console.log('=== 步骤 1: 缩略图 ===');
if (!fs.existsSync(destThumb)) { console.log('  ❌ 不存在'); process.exit(1); }
console.log(`  ✓ ${newThumbName} (${(fs.statSync(destThumb).size / 1024).toFixed(1)} KB)`);

console.log('\n=== 步骤 2: 插入 id=194 (插到 id=190 后面) ===');
let html = fs.readFileSync(indexPath, 'utf8');

if (/"id"\s*:\s*194\b/.test(html)) {
  console.log('  ⚠️ id=194 已存在，跳过');
} else {
  // 找 id=190 的对象结束位置
  // id=190 的对象长这样:
  //   {
  //     "id": 190,
  //     ...
  //   },
  // 找 "id": 190 然后找下一个 "id": (任意整数) 或数组结束

  const id190Re = /"id"\s*:\s*190\b/;
  const m = id190Re.exec(html);
  if (!m) { console.log('  ❌ 找不到 id=190'); process.exit(1); }
  const id190Pos = m.index;

  // 找 id=190 对象的 "}," 结束位置
  // 从 id=190Pos 开始往后面找 "}" + ","  (对象结束 + 逗号)
  // 然后再后面就是下一个对象开始
  const after190 = html.substring(id190Pos);
  // 找 "id": 190 后面最近的 "},\n" 或 "}\n    " 之类
  // 找最近的 "},\n" 或 "}" 后面紧跟换行
  const endRe = /\},\s*\n/;
  const endMatch = endRe.exec(after190);
  if (!endMatch) { console.log('  ❌ 找不到 id=190 对象结束'); process.exit(1); }
  // 插入点 = id=190Pos + endMatch.index + 2 (}, 之后)
  const insertPos = id190Pos + endMatch.index + endMatch[0].length;
  console.log(`  找到 id=190 对象结束位置: ${insertPos}`);

  // 在插入点处插入新对象
  // 格式: \n      {\n        ...\n      },\n
  const newObj = '\n      ' + JSON.stringify(newWork, null, 2)
    .split('\n')
    .map((line, i) => i === 0 ? line : '        ' + line)
    .join('\n') + ',\n    ';
  html = html.substring(0, insertPos) + newObj + html.substring(insertPos);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('  ✓ 已插入到 id=190 后面');
}

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
const idCount = (newHtml.match(/"id"\s*:\s*194\b/g) || []).length;
const titleCount = (newHtml.match(/旅游_街子古镇（3）斯维登酒店外景实拍/g) || []).length;

// 验证位置: id=194 应该在 id=190 后面，id=191 前面
const id190Pos = newHtml.indexOf('"id": 190');
const id191Pos = newHtml.indexOf('"id": 191');
const id194Pos = newHtml.indexOf('"id": 194');
console.log(`  id=190 位置: ${id190Pos}`);
console.log(`  id=194 位置: ${id194Pos}`);
console.log(`  id=191 位置: ${id191Pos}`);
console.log(`  位置正确 (id=190 < id=194 < id=191): ${id190Pos < id194Pos && id194Pos < id191Pos}`);
console.log(`  id=194: ${idCount}, title: ${titleCount}`);
