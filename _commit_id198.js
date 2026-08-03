// id=198: 旅游_成都熊猫基地（3）：睡美熊猫
// 常规录入
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
const indexPath = path.join(repoDir, 'index.html');
const thumbsDir = path.join(repoDir, 'thumbnails');

const newThumbName = '旅游_成都熊猫基地（3）：睡美熊猫.jpg';
const destThumb = path.join(thumbsDir, newThumbName);

console.log('=== 步骤 1: 缩略图 ===');
if (!fs.existsSync(destThumb)) { console.log('  ❌ 不存在'); process.exit(1); }
console.log(`  ✓ ${newThumbName} (${(fs.statSync(destThumb).size / 1024).toFixed(1)} KB)`);

console.log('\n=== 步骤 2: 插入 id=198 (插到数组最前面) ===');
let html = fs.readFileSync(indexPath, 'utf8');

const worksKw = html.indexOf('const works =');
const arrStart = html.indexOf('[', worksKw);
if (worksKw < 0 || arrStart < 0) { console.log('  ❌ 找不到 works 数组'); process.exit(1); }
const insertPos = arrStart + 1;
console.log(`  works 数组起始: ${arrStart}, 插入点: ${insertPos}`);

if (/"id"\s*:\s*198\b/.test(html)) { console.log('  ⚠️ id=198 已存在'); process.exit(1); }

const newObjText =
  '\n      {\n' +
  `          "id": 198,\n` +
  `          "title": "旅游_成都熊猫基地（3）：睡美熊猫",\n` +
  `          "url": "https://weixin.qq.com/sph/AECyoBa8f2",\n` +
  `          "thumbnail": "thumbnails/旅游_成都熊猫基地（3）：睡美熊猫.jpg",\n` +
  `          "description": "成都熊猫基地睡美熊猫，尾巴短短脑袋圆圆",\n` +
  `          "tags": [\n` +
  `            "江涵原创",\n` +
  `            "旅游",\n` +
  `            "视频"\n` +
  `          ],\n` +
  `          "medium": "视频",\n` +
  `          "platform": "视频号",\n` +
  `          "publishDate": "2026-08-03",\n` +
  `          "status": "已发布"\n` +
  `        },`;

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
const idCount = (newHtml.match(/"id"\s*:\s*198\b/g) || []).length;
console.log(`  id=198 计数: ${idCount}`);
