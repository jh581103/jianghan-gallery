// 改 id=147, 148, 149 - title 去掉"成都龙泉"4 个字（description 不动）
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

// 1. 复制 3 个旧缩略图为新名（去掉"成都龙泉"）
const old147 = path.join(thumbDir, '旅游_游成都龙泉石经寺（1）：石经寺实拍.jpg');
const new147 = path.join(thumbDir, '旅游_游石经寺（1）：石经寺实拍.jpg');
fs.copyFileSync(old147, new147);
console.log('复制 id=147 缩略图:', new147);

const old148 = path.join(thumbDir, '旅游_游成都龙泉石经寺（2）：转经筒实拍.jpg');
const new148 = path.join(thumbDir, '旅游_游石经寺（2）：转经筒实拍.jpg');
fs.copyFileSync(old148, new148);
console.log('复制 id=148 缩略图:', new148);

const old149 = path.join(thumbDir, '旅游_游成都龙泉石经寺（3）：池塘乌龟实拍.jpg');
const new149 = path.join(thumbDir, '旅游_游石经寺（3）：池塘乌龟实拍.jpg');
fs.copyFileSync(old149, new149);
console.log('复制 id=149 缩略图:', new149);

// 2. 改 index.html（id=147, 148, 149 整块 - 只改 title + thumbnail，description 不动）
let html = fs.readFileSync('index.html', 'utf8');

// id=147
const old147Entry = `{
      "id": 147,
      "title": "旅游_游成都龙泉石经寺（1）：石经寺实拍",
      "url": "https://weixin.qq.com/sph/AAxk8oXluH",
      "thumbnail": "thumbnails/旅游_游成都龙泉石经寺（1）：石经寺实拍.jpg",`;

const new147Entry = `{
      "id": 147,
      "title": "旅游_游石经寺（1）：石经寺实拍",
      "url": "https://weixin.qq.com/sph/AAxk8oXluH",
      "thumbnail": "thumbnails/旅游_游石经寺（1）：石经寺实拍.jpg",`;

if (!html.includes(old147Entry)) {
    console.error('❌ 未找到 id=147 旧条目');
    process.exit(1);
}
html = html.replace(old147Entry, new147Entry);
console.log('改 id=147 完成');

// id=148
const old148Entry = `{
      "id": 148,
      "title": "旅游_游成都龙泉石经寺（2）：转经筒实拍",
      "url": "https://weixin.qq.com/sph/Ai0nUTpVnt",
      "thumbnail": "thumbnails/旅游_游成都龙泉石经寺（2）：转经筒实拍.jpg",`;

const new148Entry = `{
      "id": 148,
      "title": "旅游_游石经寺（2）：转经筒实拍",
      "url": "https://weixin.qq.com/sph/Ai0nUTpVnt",
      "thumbnail": "thumbnails/旅游_游石经寺（2）：转经筒实拍.jpg",`;

if (!html.includes(old148Entry)) {
    console.error('❌ 未找到 id=148 旧条目');
    process.exit(1);
}
html = html.replace(old148Entry, new148Entry);
console.log('改 id=148 完成');

// id=149
const old149Entry = `{
      "id": 149,
      "title": "旅游_游成都龙泉石经寺（3）：池塘乌龟实拍",
      "url": "https://weixin.qq.com/sph/AblMrCUMoo",
      "thumbnail": "thumbnails/旅游_游成都龙泉石经寺（3）：池塘乌龟实拍.jpg",`;

const new149Entry = `{
      "id": 149,
      "title": "旅游_游石经寺（3）：池塘乌龟实拍",
      "url": "https://weixin.qq.com/sph/AblMrCUMoo",
      "thumbnail": "thumbnails/旅游_游石经寺（3）：池塘乌龟实拍.jpg",`;

if (!html.includes(old149Entry)) {
    console.error('❌ 未找到 id=149 旧条目');
    process.exit(1);
}
html = html.replace(old149Entry, new149Entry);
console.log('改 id=149 完成');

fs.writeFileSync('index.html', html, 'utf8');
console.log('改 index.html 完成（id=147, 148, 149）');

console.log('');
console.log('新文件已复制，index.html 已改。下一步：PowerShell 删旧缩略图 + commit + push');
