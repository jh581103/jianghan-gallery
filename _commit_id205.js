// id=205: 旅游_半亩方塘（3）：半亩方塘酒店院落夜景
// 常规录入 (半亩方塘系列第 3 集)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
const indexPath = path.join(repoDir, 'index.html');
const thumbsDir = path.join(repoDir, 'thumbnails');

const newThumbName = '旅游_半亩方塘（3）：半亩方塘酒店院落夜景.jpg';
const destThumb = path.join(thumbsDir, newThumbName);

console.log('=== 步骤 1: 缩略图 ===');
if (!fs.existsSync(destThumb)) { console.log('  ❌ 不存在'); process.exit(1); }
console.log(`  ✓ ${newThumbName} (${(fs.statSync(destThumb).size / 1024).toFixed(1)} KB)`);

console.log('\n=== 步骤 2: 插入 id=205 (插到数组最前面) ===');
let html = fs.readFileSync(indexPath, 'utf8');

const worksKw = html.indexOf('const works =');
const arrStart = html.indexOf('[', worksKw);
if (worksKw < 0 || arrStart < 0) { console.log('  ❌ 找不到 works 数组'); process.exit(1); }
const insertPos = arrStart + 1;

if (/"id"\s*:\s*205\b/.test(html)) { console.log('  ⚠️ id=205 已存在'); process.exit(1); }

const newObjText =
  '\n      {\n' +
  `          "id": 205,\n` +
  `          "title": "旅游_半亩方塘（3）：半亩方塘酒店院落夜景",\n` +
  `          "url": "https://weixin.qq.com/sph/AbAk9e31P9",\n` +
  `          "thumbnail": "thumbnails/旅游_半亩方塘（3）：半亩方塘酒店院落夜景.jpg",\n` +
  `          "description": "温江半亩方塘酒店院落夜景，灯光水景",\n` +
  `          "tags": [\n` +
  `            "江涵原创",\n` +
  `            "旅游",\n` +
  `            "视频"\n` +
  `          ],\n` +
  `          "medium": "视频",\n` +
  `          "platform": "视频号",\n` +
  `          "publishDate": "2026-08-04",\n` +
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
const idCount = (newHtml.match(/"id"\s*:\s*205\b/g) || []).length;
console.log(`  id=205 计数: ${idCount}`);
