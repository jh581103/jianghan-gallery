// 复合任务: 改名 id=181, id=182 去掉"实拍" + 录 id=183
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
const indexPath = path.join(repoDir, 'index.html');
const thumbsDir = path.join(repoDir, 'thumbnails');

// === 改名 1: id=181 ===
const old181Thumb = '旅游_四川博物馆实拍（1）：外景｜大厅｜体验馆.jpg';
const new181Thumb = '旅游_四川博物馆（1）：外景｜大厅｜体验馆.jpg';
const old181Title = '旅游_四川博物馆实拍（1）：外景｜大厅｜体验馆';
const new181Title = '旅游_四川博物馆（1）：外景｜大厅｜体验馆';

// === 改名 2: id=182 ===
const old182Thumb = '旅游_四川博物馆实拍（2）：远古四川.jpg';
const new182Thumb = '旅游_四川博物馆（2）：远古四川.jpg';
const old182Title = '旅游_四川博物馆实拍（2）：远古四川';
const new182Title = '旅游_四川博物馆（2）：远古四川';

// === 录新作品 id=183 ===
const new183Thumb = '旅游_四川博物馆（3）：古代四川.jpg';
const new183Work = {
  id: 183,
  title: '旅游_四川博物馆（3）：古代四川',
  url: 'https://weixin.qq.com/sph/A4PvAAByEF',
  thumbnail: 'thumbnails/' + new183Thumb,
  description: '四川博物馆古代四川厅，秦汉三国时期',
  tags: ['江涵原创', '旅游', '视频'],
  medium: '视频',
  platform: '视频号',
  publishDate: '2026-08-02',
  status: '已发布',
};

console.log('=== 步骤 1: 改 id=181 (去"实拍") ===');
let html = fs.readFileSync(indexPath, 'utf8');

const old181TJson = `"title": "${old181Title}"`;
const new181TJson = `"title": "${new181Title}"`;
const old181ThumbField = `"thumbnail": "thumbnails/${old181Thumb}"`;
const new181ThumbField = `"thumbnail": "thumbnails/${new181Thumb}"`;

if (html.includes(old181TJson)) {
  html = html.replace(old181TJson, new181TJson);
  console.log('  ✓ id=181 title 改');
} else { console.log('  ⚠️ id=181 title 已是新（已改过）'); }
if (html.includes(old181ThumbField)) {
  html = html.replace(old181ThumbField, new181ThumbField);
  console.log('  ✓ id=181 thumbnail 字段改');
} else { console.log('  ⚠️ id=181 thumbnail 字段已是新'); }

// 物理文件 rename id=181
const old181ThumbPath = path.join(thumbsDir, old181Thumb);
const new181ThumbPath = path.join(thumbsDir, new181Thumb);
if (fs.existsSync(old181ThumbPath)) {
  if (!fs.existsSync(new181ThumbPath)) {
    fs.renameSync(old181ThumbPath, new181ThumbPath);
    console.log('  ✓ 缩略图 rename: ' + old181Thumb + ' -> ' + new181Thumb);
  } else {
    console.log('  ⚠️ 新缩略图已存在，跳过 rename');
  }
} else {
  console.log('  ⚠️ 老缩略图不存在（可能已 rename）');
}

console.log('\n=== 步骤 2: 改 id=182 (去"实拍") ===');
const old182TJson = `"title": "${old182Title}"`;
const new182TJson = `"title": "${new182Title}"`;
const old182ThumbField = `"thumbnail": "thumbnails/${old182Thumb}"`;
const new182ThumbField = `"thumbnail": "thumbnails/${new182Thumb}"`;

if (html.includes(old182TJson)) {
  html = html.replace(old182TJson, new182TJson);
  console.log('  ✓ id=182 title 改');
} else { console.log('  ⚠️ id=182 title 已是新（已改过）'); }
if (html.includes(old182ThumbField)) {
  html = html.replace(old182ThumbField, new182ThumbField);
  console.log('  ✓ id=182 thumbnail 字段改');
} else { console.log('  ⚠️ id=182 thumbnail 字段已是新'); }

const old182ThumbPath = path.join(thumbsDir, old182Thumb);
const new182ThumbPath = path.join(thumbsDir, new182Thumb);
if (fs.existsSync(old182ThumbPath)) {
  if (!fs.existsSync(new182ThumbPath)) {
    fs.renameSync(old182ThumbPath, new182ThumbPath);
    console.log('  ✓ 缩略图 rename: ' + old182Thumb + ' -> ' + new182Thumb);
  } else {
    console.log('  ⚠️ 新缩略图已存在，跳过 rename');
  }
} else {
  console.log('  ⚠️ 老缩略图不存在（可能已 rename）');
}

console.log('\n=== 步骤 3: 录 id=183 ===');
const new183ThumbPath = path.join(thumbsDir, new183Thumb);
if (!fs.existsSync(new183ThumbPath)) {
  console.log('  ❌ id=183 缩略图不存在');
  process.exit(1);
}
console.log(`  ✓ 缩略图存在: ${new183Thumb} (${(fs.statSync(new183ThumbPath).size / 1024).toFixed(1)} KB)`);

const worksKw = html.indexOf('const works =');
if (worksKw < 0) { console.log('  ❌ 找不到 const works'); process.exit(1); }
const arrStart = html.indexOf('[', worksKw);
if (arrStart < 0) { console.log('  ❌ 找不到 ['); process.exit(1); }
const insertPos = arrStart + 1;

if (/"id"\s*:\s*183\b/.test(html)) {
  console.log('  ⚠️ id=183 已存在，跳过');
} else {
  const newObj = '\n      ' + JSON.stringify(new183Work, null, 2)
    .split('\n')
    .map((line, i) => i === 0 ? line : '        ' + line)
    .join('\n') + ',\n    ';
  html = html.substring(0, insertPos) + newObj + html.substring(insertPos);
  console.log('  ✓ id=183 已插入');
}

fs.writeFileSync(indexPath, html, 'utf8');

console.log('\n=== 步骤 4: syntax 验证 ===');
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

console.log('\n=== 步骤 5: 验证 ===');
const newHtml = fs.readFileSync(indexPath, 'utf8');
const id183Count = (newHtml.match(/"id"\s*:\s*183\b/g) || []).length;
const new181Count = (newHtml.match(new RegExp(new181TJson.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
const old181Left = (newHtml.match(new RegExp(old181TJson.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
const new182Count = (newHtml.match(new RegExp(new182TJson.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
const old182Left = (newHtml.match(new RegExp(old182TJson.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
console.log(`  id=183: ${id183Count} (应为 1)`);
console.log(`  id=181 新 title: ${new181Count} (应为 1), 老 title 残留: ${old181Left} (应为 0)`);
console.log(`  id=182 新 title: ${new182Count} (应为 1), 老 title 残留: ${old182Left} (应为 0)`);
console.log(`  老 id=181 缩略图存在: ${fs.existsSync(old181ThumbPath)} (应为 false)`);
console.log(`  新 id=181 缩略图存在: ${fs.existsSync(new181ThumbPath)} (应为 true)`);
console.log(`  老 id=182 缩略图存在: ${fs.existsSync(old182ThumbPath)} (应为 false)`);
console.log(`  新 id=182 缩略图存在: ${fs.existsSync(new182ThumbPath)} (应为 true)`);
