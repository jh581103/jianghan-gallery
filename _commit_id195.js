// id=195: 旅游_大邑县慈云寺实拍
// 常规录入: 缩略图名=作品名.jpg, description=AI 自由发挥, tags=[江涵原创,旅游,视频]
// publishDate=2026-08-03 (今天)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
const indexPath = path.join(repoDir, 'index.html');
const thumbsDir = path.join(repoDir, 'thumbnails');

const newThumbName = '旅游_大邑县慈云寺实拍.jpg';
const destThumb = path.join(thumbsDir, newThumbName);

const newWork = {
  id: 195,
  title: '旅游_大邑县慈云寺实拍',
  url: 'https://weixin.qq.com/sph/ARPu3JUUBV',
  thumbnail: 'thumbnails/' + newThumbName,
  description: '大邑县慈云寺（原东狱庙）外景，红墙与指示牌',
  tags: ['江涵原创', '旅游', '视频'],
  medium: '视频',
  platform: '视频号',
  publishDate: '2026-08-03',
  status: '已发布',
};

console.log('=== 步骤 1: 缩略图 ===');
if (!fs.existsSync(destThumb)) { console.log('  ❌ 不存在'); process.exit(1); }
console.log(`  ✓ ${newThumbName} (${(fs.statSync(destThumb).size / 1024).toFixed(1)} KB)`);

console.log('\n=== 步骤 2: 插入 id=195 (插到数组最前面, desc 排排第 1 位) ===');
let html = fs.readFileSync(indexPath, 'utf8');

// 定位 works 数组
const worksKw = html.indexOf('const works =');
const arrStart = html.indexOf('[', worksKw);
if (worksKw < 0 || arrStart < 0) {
  console.log('  ❌ 找不到 works 数组');
  process.exit(1);
}
const insertPos = arrStart + 1;  // 在 [ 后面插入
console.log(`  works 数组起始: ${arrStart}, 插入点: ${insertPos}`);

if (/"id"\s*:\s*195\b/.test(html)) {
  console.log('  ⚠️ id=195 已存在');
  process.exit(1);
}

// 构造新对象 (按数组现有格式: 6 空格 { + 10 空格字段 + 8 空格 },)
const newObjText =
  '\n      {\n' +
  `          "id": 195,\n` +
  `          "title": "旅游_大邑县慈云寺实拍",\n` +
  `          "url": "https://weixin.qq.com/sph/ARPu3JUUBV",\n` +
  `          "thumbnail": "thumbnails/旅游_大邑县慈云寺实拍.jpg",\n` +
  `          "description": "大邑县慈云寺（原东狱庙）外景，红墙与指示牌",\n` +
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

// 取出插入点前后的内容确认
const before = html.substring(Math.max(0, insertPos - 5), insertPos);
const after = html.substring(insertPos, Math.min(html.length, insertPos + 30));
console.log(`  插入点前 (最后 5 字): ${JSON.stringify(before)}`);
console.log(`  插入点后 (前 30 字): ${JSON.stringify(after)}`);

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
const newArrEnd = newHtml.indexOf('\n      ]\r\n    ;', newArrStart);
const newArrText = newHtml.substring(newArrStart, newArrEnd + 1);

const idCount = (newArrText.match(/"id"\s*:\s*195\b/g) || []).length;
console.log(`  id=195 计数: ${idCount}`);

const id195Pos = newArrText.indexOf('"id": 195');
const id193Pos = newArrText.indexOf('"id": 193');
console.log(`  id=195 位置: ${id195Pos}, id=193 位置: ${id193Pos}`);
console.log(`  195 在最前 (id=195 < id=193): ${id195Pos < id193Pos}`);
