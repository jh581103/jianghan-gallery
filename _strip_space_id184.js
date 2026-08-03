// id=184 去空格: 旅游_ 四川博物馆（4）→旅游_四川博物馆（4）
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
const indexPath = path.join(repoDir, 'index.html');
const thumbsDir = path.join(repoDir, 'thumbnails');

const oldTitle = '旅游_ 四川博物馆（4）：清代象牙雕';
const newTitle = '旅游_四川博物馆（4）：清代象牙雕';
const oldThumbName = '旅游_ 四川博物馆（4）：清代象牙雕.jpg';
const newThumbName = '旅游_四川博物馆（4）：清代象牙雕.jpg';

console.log('=== 步骤 1: 改 index.html ===');
let html = fs.readFileSync(indexPath, 'utf8');

const oldTJson = `"title": "${oldTitle}"`;
const newTJson = `"title": "${newTitle}"`;
if (html.includes(oldTJson)) {
  html = html.replace(oldTJson, newTJson);
  console.log('  ✓ title 改');
} else {
  console.log('  ⚠️ 老 title 不存在（可能已改过）');
}

const oldThumbField = `"thumbnail": "thumbnails/${oldThumbName}"`;
const newThumbField = `"thumbnail": "thumbnails/${newThumbName}"`;
if (html.includes(oldThumbField)) {
  html = html.replace(oldThumbField, newThumbField);
  console.log('  ✓ thumbnail 字段改');
} else {
  console.log('  ⚠️ 老 thumbnail 字段不存在');
}

fs.writeFileSync(indexPath, html, 'utf8');

console.log('\n=== 步骤 2: 改缩略图物理文件 ===');
const oldThumbPath = path.join(thumbsDir, oldThumbName);
const newThumbPath = path.join(thumbsDir, newThumbName);
if (fs.existsSync(oldThumbPath)) {
  if (!fs.existsSync(newThumbPath)) {
    fs.renameSync(oldThumbPath, newThumbPath);
    console.log(`  ✓ rename: ${oldThumbName} -> ${newThumbName}`);
  } else {
    console.log('  ⚠️ 新文件已存在');
  }
} else {
  console.log('  ⚠️ 老文件不存在（可能已 rename）');
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
const newTCount = (newHtml.match(new RegExp(newTJson.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
const oldTLeft = (newHtml.match(new RegExp(oldTJson.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
console.log(`  新 title 出现: ${newTCount} (应为 1)`);
console.log(`  老 title 残留: ${oldTLeft} (应为 0)`);
console.log(`  老缩略图存在: ${fs.existsSync(oldThumbPath)} (应为 false)`);
console.log(`  新缩略图存在: ${fs.existsSync(newThumbPath)} (应为 true)`);
