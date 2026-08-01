// 改 id=138, 139 - 中文数字（五）（六）→ 阿拉伯数字（5）（6）
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
process.chdir(repoDir);

// 0. 再次确认本地 = 远程（铁律）
const ahead = parseInt(execFileSync('git', ['rev-list', '--count', 'origin/main..HEAD'], { encoding: 'utf8' }).trim());
const behind = parseInt(execFileSync('git', ['rev-list', '--count', 'HEAD..origin/main'], { encoding: 'utf8' }).trim());
if (ahead !== 0 || behind !== 0) {
    console.error(`❌ pull 铁律违反: ahead=${ahead}, behind=${behind}`);
    process.exit(1);
}
console.log('✅ pull 铁律检查通过 (ahead=0, behind=0)');

const thumbDir = path.join(repoDir, 'thumbnails');

// 1. 复制 id=138 旧缩略图为新名
const oldThumb138 = path.join(thumbDir, '旅游_阆中之旅（五）：古城边美丽的嘉陵江美景实拍.jpg');
const newThumb138 = path.join(thumbDir, '旅游_阆中之旅（5）：古城边美丽的嘉陵江美景实拍.jpg');
fs.copyFileSync(oldThumb138, newThumb138);
const stat138 = fs.statSync(newThumb138);
console.log('复制 id=138 缩略图:', newThumb138, '(' + (stat138.size / 1024).toFixed(1) + ' KB)');

// 2. 复制 id=139 旧缩略图为新名
const oldThumb139 = path.join(thumbDir, '旅游_阆中之旅（六）：阆中古城中天楼上留影.jpg');
const newThumb139 = path.join(thumbDir, '旅游_阆中之旅（6）：阆中古城中天楼上留影.jpg');
fs.copyFileSync(oldThumb139, newThumb139);
const stat139 = fs.statSync(newThumb139);
console.log('复制 id=139 缩略图:', newThumb139, '(' + (stat139.size / 1024).toFixed(1) + ' KB)');

// 3. 改 index.html（id=138 + id=139 整块）
let html = fs.readFileSync('index.html', 'utf8');

// id=138 旧块 → 新块
const old138 = `{
      "id": 138,
      "title": "旅游_阆中之旅（五）：古城边美丽的嘉陵江美景实拍",
      "url": "https://weixin.qq.com/sph/AAxczT3T6C",
      "thumbnail": "thumbnails/旅游_阆中之旅（五）：古城边美丽的嘉陵江美景实拍.jpg",
      "description": "2023.8.24 阆中之旅（五），古城边美丽的嘉陵江美景实拍纪念。",`;

const new138 = `{
      "id": 138,
      "title": "旅游_阆中之旅（5）：古城边美丽的嘉陵江美景实拍",
      "url": "https://weixin.qq.com/sph/AAxczT3T6C",
      "thumbnail": "thumbnails/旅游_阆中之旅（5）：古城边美丽的嘉陵江美景实拍.jpg",
      "description": "2023.8.24 阆中之旅（5），古城边美丽的嘉陵江美景实拍纪念。",`;

if (!html.includes(old138)) {
    console.error('❌ 未找到 id=138 旧条目，原文未动');
    process.exit(1);
}
html = html.replace(old138, new138);
console.log('改 id=138 完成');

// id=139 旧块 → 新块
const old139 = `{
      "id": 139,
      "title": "旅游_阆中之旅（六）：阆中古城中天楼上留影",
      "url": "https://weixin.qq.com/sph/Aa3UPh77U4",
      "thumbnail": "thumbnails/旅游_阆中之旅（六）：阆中古城中天楼上留影.jpg",
      "description": "2023.8.24 阆中之旅（六），阆中古城中天楼上留影纪念。",`;

const new139 = `{
      "id": 139,
      "title": "旅游_阆中之旅（6）：阆中古城中天楼上留影",
      "url": "https://weixin.qq.com/sph/Aa3UPh77U4",
      "thumbnail": "thumbnails/旅游_阆中之旅（6）：阆中古城中天楼上留影.jpg",
      "description": "2023.8.24 阆中之旅（6），阆中古城中天楼上留影纪念。",`;

if (!html.includes(old139)) {
    console.error('❌ 未找到 id=139 旧条目，原文未动');
    process.exit(1);
}
html = html.replace(old139, new139);
console.log('改 id=139 完成');

fs.writeFileSync('index.html', html, 'utf8');
console.log('改 index.html 完成（id=138, 139）');

console.log('');
console.log('新文件已复制，index.html 已改。下一步：PowerShell 删旧缩略图 + commit + push');
