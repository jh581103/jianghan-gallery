// id=172 改名: 旅游_成都国庆川剧表演 -> 旅游_成都国庆（1）：川剧表演
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
const indexPath = path.join(repoDir, 'index.html');
const thumbsDir = path.join(repoDir, 'thumbnails');

const oldThumbName = '旅游_成都国庆川剧表演.jpg';
const newThumbName = '旅游_成都国庆（1）：川剧表演.jpg';
const oldThumb = path.join(thumbsDir, oldThumbName);
const newThumb = path.join(thumbsDir, newThumbName);

const oldTitle = '旅游_成都国庆川剧表演';
const newTitle = '旅游_成都国庆（1）：川剧表演';

console.log('=== 步骤 1: 缩略图改名 ===');
if (!fs.existsSync(oldThumb)) {
  console.log(`  ❌ 找不到 ${oldThumbName}`);
  process.exit(1);
}
if (fs.existsSync(newThumb)) {
  console.log(`  ⚠️ 新名已存在，跳过 rename`);
} else {
  fs.renameSync(oldThumb, newThumb);
  console.log(`  ✓ ${oldThumbName} -> ${newThumbName}`);
}

console.log('\n=== 步骤 2: 改 index.html ===');
let html = fs.readFileSync(indexPath, 'utf8');

// 1) 改 title
const oldTitleJson = `"title": "${oldTitle}"`;
const newTitleJson = `"title": "${newTitle}"`;
if (!html.includes(oldTitleJson)) {
  console.log(`  ❌ 找不到 title: ${oldTitleJson}`);
  process.exit(1);
}
if (html.includes(newTitleJson)) {
  console.log(`  ⚠️ 新 title 已存在，跳过 title 改`);
} else {
  html = html.replace(oldTitleJson, newTitleJson);
  console.log(`  ✓ title 已改`);
}

// 2) 改 thumbnail 字段（路径）
const oldThumbField = `"thumbnail": "thumbnails/${oldThumbName}"`;
const newThumbField = `"thumbnail": "thumbnails/${newThumbName}"`;
if (!html.includes(oldThumbField)) {
  console.log(`  ❌ 找不到 thumbnail 字段`);
  process.exit(1);
}
if (html.includes(newThumbField)) {
  console.log(`  ⚠️ 新 thumbnail 字段已存在，跳过`);
} else {
  html = html.replace(oldThumbField, newThumbField);
  console.log(`  ✓ thumbnail 字段已改`);
}

fs.writeFileSync(indexPath, html, 'utf8');

console.log('\n=== 步骤 3: syntax 验证 ===');
const tmpJs = path.join(repoDir, '_tmp_syntax_check.js');
const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];
fs.writeFileSync(tmpJs, code, 'utf8');
try {
  execFileSync('node', ['--check', tmpJs], { stdio: 'pipe' });
  console.log('  ✓ script 块 syntax OK');
} catch (e) {
  console.log('  ❌ script 块 syntax 错:');
  console.log('    ' + e.stderr.toString().split('\n').slice(0, 5).join('\n    '));
  fs.unlinkSync(tmpJs);
  process.exit(1);
}
fs.unlinkSync(tmpJs);

console.log('\n=== 步骤 4: 验证 ===');
const newHtml = fs.readFileSync(indexPath, 'utf8');
const oldTitleLeft = (newHtml.match(new RegExp(oldTitleJson.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
const newTitleCount = (newHtml.match(new RegExp(newTitleJson.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
const oldThumbLeft = (newHtml.match(new RegExp(oldThumbField.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
const newThumbCount = (newHtml.match(new RegExp(newThumbField.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
console.log(`  老 title 剩余: ${oldTitleLeft} (应为 0)`);
console.log(`  新 title 出现: ${newTitleCount} (应为 1)`);
console.log(`  老 thumb 字段剩余: ${oldThumbLeft} (应为 0)`);
console.log(`  新 thumb 字段出现: ${newThumbCount} (应为 1)`);
console.log(`  老缩略图文件存在: ${fs.existsSync(oldThumb)} (应为 false)`);
console.log(`  新缩略图文件存在: ${fs.existsSync(newThumb)} (应为 true)`);
