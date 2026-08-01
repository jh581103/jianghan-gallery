// 西溪云间 8 个：移到 thumbnails/ + 加序号（跟批 1 一样）
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

// 数据：[id, oldTitle, newTitle, oldRootFile, newThumbFile, oldThumbField, newThumbField]
// 注意：title 和 thumb 都用中文弯引号 " "（U+201C/U+201D）
const changes = [
    [120, '旅游_西岭雪山下民宿“西溪云间”实拍', '旅游_西溪云间（1）：西岭雪山下民宿实拍',
        '旅游_西岭雪山下民宿“西溪云间”实拍.jpg', '旅游_西溪云间（1）：西岭雪山下民宿实拍.jpg',
        '旅游_西岭雪山下民宿“西溪云间”实拍.jpg', 'thumbnails/旅游_西溪云间（1）：西岭雪山下民宿实拍.jpg'],
    [121, '旅游_“西溪云间”民宿的美餐实录', '旅游_西溪云间（2）：民宿的美餐实录',
        '旅游_“西溪云间”民宿的美餐实录.jpg', '旅游_西溪云间（2）：民宿的美餐实录.jpg',
        '旅游_“西溪云间”民宿的美餐实录.jpg', 'thumbnails/旅游_西溪云间（2）：民宿的美餐实录.jpg'],
    [122, '旅游_趣走“西溪云间”石板小路', '旅游_西溪云间（3）：趣走石板小路',
        '旅游_趣走“西溪云间”石板小路.jpg', '旅游_西溪云间（3）：趣走石板小路.jpg',
        '旅游_趣走“西溪云间”石板小路.jpg', 'thumbnails/旅游_西溪云间（3）：趣走石板小路.jpg'],
    [123, '旅游_“西溪云间”留个影', '旅游_西溪云间（4）：留个影',
        '旅游_“西溪云间”留个影.jpg', '旅游_西溪云间（4）：留个影.jpg',
        '旅游_“西溪云间”留个影.jpg', 'thumbnails/旅游_西溪云间（4）：留个影.jpg'],
    [124, '旅游_“西溪云间”留影', '旅游_西溪云间（5）：留影',
        '旅游_“西溪云间”留影.jpg', '旅游_西溪云间（5）：留影.jpg',
        '旅游_“西溪云间”留影.jpg', 'thumbnails/旅游_西溪云间（5）：留影.jpg'],
    [125, '旅游_“西溪云间”外景实拍', '旅游_西溪云间（6）：外景实拍',
        '旅游_“西溪云间”外景实拍.jpg', '旅游_西溪云间（6）：外景实拍.jpg',
        '旅游_“西溪云间”外景实拍.jpg', 'thumbnails/旅游_西溪云间（6）：外景实拍.jpg'],
    [126, '旅游_“西溪云间”夜景实拍', '旅游_西溪云间（7）：夜景实拍',
        '旅游_“西溪云间”夜景实拍.jpg', '旅游_西溪云间（7）：夜景实拍.jpg',
        '旅游_“西溪云间”夜景实拍.jpg', 'thumbnails/旅游_西溪云间（7）：夜景实拍.jpg'],
    [127, '旅游_“西溪云间”的茶香茶韵', '旅游_西溪云间（8）：茶香茶韵',
        '旅游_“西溪云间”的茶香茶韵.jpg', '旅游_西溪云间（8）：茶香茶韵.jpg',
        '旅游_“西溪云间”的茶香茶韵.jpg', 'thumbnails/旅游_西溪云间（8）：茶香茶韵.jpg']
];

// 1. 移动 8 个文件：仓库根 → thumbnails/
console.log('\n=== 移动 8 个文件 ===');
for (const [id, oldTitle, newTitle, oldRootFile, newThumbFile] of changes) {
    const oldPath = path.join(repoDir, oldRootFile);
    const newPath = path.join(thumbDir, newThumbFile);

    if (!fs.existsSync(oldPath)) {
        console.error(`❌ 源文件不存在: ${oldPath}`);
        process.exit(1);
    }
    if (fs.existsSync(newPath)) {
        console.error(`❌ 目标文件已存在: ${newPath}`);
        process.exit(1);
    }
    fs.renameSync(oldPath, newPath);
    const stat = fs.statSync(newPath);
    console.log(`  id=${id}: ${(stat.size / 1024).toFixed(1)} KB`);
}

// 2. 改 index.html
console.log('\n=== 改 index.html ===');
let html = fs.readFileSync('index.html', 'utf8');

for (const [id, oldTitle, newTitle, oldRootFile, newThumbFile, oldThumbField, newThumbField] of changes) {
    const blockRegex = new RegExp(`\\{[^{}]*?"id":\\s*${id}[^{}]*?\\}`);
    const match = html.match(blockRegex);
    if (!match) {
        console.error(`❌ 未找到 id=${id} 整块`);
        process.exit(1);
    }

    const oldBlock = match[0];
    let newBlock = oldBlock;

    // 替换 title（用正则兼容 workbuddy 的 "key":"value" 格式）
    const titleRegex = new RegExp(`"title":\\s*"${oldTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`);
    if (!titleRegex.test(oldBlock)) {
        console.error(`❌ id=${id} title 不匹配: ${oldTitle}`);
        process.exit(1);
    }
    newBlock = newBlock.replace(titleRegex, `"title":"${newTitle}"`);

    // 替换 thumbnail
    const thumbRegex = new RegExp(`"thumbnail":\\s*"${oldThumbField.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`);
    if (!thumbRegex.test(oldBlock)) {
        console.error(`❌ id=${id} thumb 不匹配: ${oldThumbField}`);
        process.exit(1);
    }
    newBlock = newBlock.replace(thumbRegex, `"thumbnail":"${newThumbField}"`);

    html = html.replace(oldBlock, newBlock);
    console.log(`  id=${id} OK`);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('\n✅ index.html 已改');

console.log('\n下一步：git add + commit + push');
