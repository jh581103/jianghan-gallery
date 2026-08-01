// 批 2: 20 个作品加序号（悉尼 4 + 美国 1 号公路 4 + 峨眉 3 + 峨眉大酒店 3 + 大运会主场馆 3 + 青羊宫 3）
// 移到 thumbnails/ + 改 title 和 thumb 字段
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
// 注：title 和 thumb 用全角中文引号 " "（U+201C/U+201D）
const changes = [
    // ===== 悉尼 4 个 (id=86, 88, 89, 90) =====
    [86, '旅游_悉尼影缘', '旅游_悉尼（1）：影缘',
        '旅游_悉尼影缘.jpg', '旅游_悉尼（1）：影缘.jpg',
        '旅游_悉尼影缘.jpg', 'thumbnails/旅游_悉尼（1）：影缘.jpg'],
    [88, '旅游_悉尼留影', '旅游_悉尼（2）：留影',
        '旅游_悉尼留影.jpg', '旅游_悉尼（2）：留影.jpg',
        '旅游_悉尼留影.jpg', 'thumbnails/旅游_悉尼（2）：留影.jpg'],
    [89, '旅游_百变立体呈现澳大利亚悉尼留影', '旅游_悉尼（3）：百变立体呈现澳大利亚留影',
        '旅游_百变立体呈现澳大利亚悉尼留影.jpg', '旅游_悉尼（3）：百变立体呈现澳大利亚留影.jpg',
        '旅游_百变立体呈现澳大利亚悉尼留影.jpg', 'thumbnails/旅游_悉尼（3）：百变立体呈现澳大利亚留影.jpg'],
    [90, '旅游_穿梭悉尼的时刻', '旅游_悉尼（4）：穿梭的时刻',
        '旅游_穿梭悉尼的时刻.jpg', '旅游_悉尼（4）：穿梭的时刻.jpg',
        '旅游_穿梭悉尼的时刻.jpg', 'thumbnails/旅游_悉尼（4）：穿梭的时刻.jpg'],

    // ===== 美国 1 号公路 4 个 (id=101-104) =====
    [101, '旅游_美加州1号公路旁的小松鼠', '旅游_美国1号公路（1）：美加州旁的小松鼠',
        '旅游_美加州1号公路旁的小松鼠.jpg', '旅游_美国1号公路（1）：美加州旁的小松鼠.jpg',
        '旅游_美加州1号公路旁的小松鼠.jpg', 'thumbnails/旅游_美国1号公路（1）：美加州旁的小松鼠.jpg'],
    [102, '旅游_美国1号公路海岸海景实拍', '旅游_美国1号公路（2）：海岸海景实拍',
        '旅游_美国1号公路海岸海景实拍.jpg', '旅游_美国1号公路（2）：海岸海景实拍.jpg',
        '旅游_美国1号公路海岸海景实拍.jpg', 'thumbnails/旅游_美国1号公路（2）：海岸海景实拍.jpg'],
    [103, '旅游_美国加州1号公路海景海鸥实拍', '旅游_美国1号公路（3）：加州海景海鸥实拍',
        '旅游_美国加州1号公路海景海鸥实拍.jpg', '旅游_美国1号公路（3）：加州海景海鸥实拍.jpg',
        '旅游_美国加州1号公路海景海鸥实拍.jpg', 'thumbnails/旅游_美国1号公路（3）：加州海景海鸥实拍.jpg'],
    [104, '旅游_美国加州1号公路美景实拍', '旅游_美国1号公路（4）：加州美景实拍',
        '旅游_美国加州1号公路美景实拍.jpg', '旅游_美国1号公路（4）：加州美景实拍.jpg',
        '旅游_美国加州1号公路美景实拍.jpg', 'thumbnails/旅游1号公路（4）：加州美景实拍.jpg'],

    // ===== 峨眉 3 个 (id=72, 73, 74) =====
    [72, '旅游_峨眉万年寺实拍', '旅游_峨眉（1）：万年寺实拍',
        '旅游_峨眉万年寺实拍.jpg', '旅游_峨眉（1）：万年寺实拍.jpg',
        '旅游_峨眉万年寺实拍.jpg', 'thumbnails/旅游_峨眉（1）：万年寺实拍.jpg'],
    [73, '旅游_峨眉报国寺实拍', '旅游_峨眉（2）：报国寺实拍',
        '旅游_峨眉报国寺实拍.jpg', '旅游_峨眉（2）：报国寺实拍.jpg',
        '旅游_峨眉报国寺实拍.jpg', 'thumbnails/旅游_峨眉（2）：报国寺实拍.jpg'],
    [74, '旅游_万年寺报国寺留影', '旅游_峨眉（3）：万年寺报国寺留影',
        '旅游_万年寺报国寺留影.jpg', '旅游_峨眉（3）：万年寺报国寺留影.jpg',
        '旅游_万年寺报国寺留影.jpg', 'thumbnails/旅游_峨眉（3）：万年寺报国寺留影.jpg'],

    // ===== 峨眉大酒店 3 个 (id=75, 76, 77) =====
    [75, '旅游_峨眉大酒店前广场留影', '旅游_峨眉大酒店（1）：前广场留影',
        '旅游_峨眉大酒店前广场留影.jpg', '旅游_峨眉大酒店（1）：前广场留影.jpg',
        '旅游_峨眉大酒店前广场留影.jpg', 'thumbnails/旅游_峨眉大酒店（1）：前广场留影.jpg'],
    [76, '旅游_峨眉大酒店泡氡温泉', '旅游_峨眉大酒店（2）：泡氡温泉',
        '旅游_峨眉大酒店泡氡温泉.jpg', '旅游_峨眉大酒店（2）：泡氡温泉.jpg',
        '旅游_峨眉大酒店泡氡温泉.jpg', 'thumbnails/旅游_峨眉大酒店（2）：泡氡温泉.jpg'],
    [77, '旅游_峨眉大酒店氡温泉冲浪按摩', '旅游_峨眉大酒店（3）：氡温泉冲浪按摩',
        '旅游_峨眉大酒店氡温泉冲浪按摩.jpg', '旅游_峨眉大酒店（3）：氡温泉冲浪按摩.jpg',
        '旅游_峨眉大酒店氡温泉冲浪按摩.jpg', 'thumbnails/旅游_峨眉大酒店（3）：氡温泉冲浪按摩.jpg'],

    // ===== 成都大运会 3 个 (id=110, 112, 114) =====
    [110, '旅游_成都大运会会址实拍', '旅游_成都大运会（1）：会址实拍',
        '旅游_成都大运会会址实拍.jpg', '旅游_成都大运会（1）：会址实拍.jpg',
        '旅游_成都大运会会址实拍.jpg', 'thumbnails/旅游_成都大运会（1）：会址实拍.jpg'],
    [112, '旅游_成都大运会主场馆实拍', '旅游_成都大运会（2）：主场馆实拍',
        '旅游_成都大运会主场馆实拍.jpg', '旅游_成都大运会（2）：主场馆实拍.jpg',
        '旅游_成都大运会主场馆实拍.jpg', 'thumbnails/旅游_成都大运会（2）：主场馆实拍.jpg'],
    [114, '旅游_成都大运会主场馆外景留影', '旅游_成都大运会（3）：主场馆外景留影',
        '旅游_成都大运会主场馆外景留影.jpg', '旅游_成都大运会（3）：主场馆外景留影.jpg',
        '旅游_成都大运会主场馆外景留影.jpg', 'thumbnails/旅游_成都大运会（3）：主场馆外景留影.jpg'],

    // ===== 成都青羊宫 3 个 (id=115, 116, 117) =====
    [115, '旅游_成都青羊宫实拍', '旅游_成都青羊宫（1）：实拍',
        '旅游_成都青羊宫实拍.jpg', '旅游_成都青羊宫（1）：实拍.jpg',
        '旅游_成都青羊宫实拍.jpg', 'thumbnails/旅游_成都青羊宫（1）：实拍.jpg'],
    [116, '旅游_成都青羊宫开心喝茶', '旅游_成都青羊宫（2）：开心喝茶',
        '旅游_成都青羊宫开心喝茶.jpg', '旅游_成都青羊宫（2）：开心喝茶.jpg',
        '旅游_成都青羊宫开心喝茶.jpg', 'thumbnails/旅游_成都青羊宫（2）：开心喝茶.jpg'],
    [117, '旅游_成都青羊宫“寿”字前留影', '旅游_成都青羊宫（3）：“寿”字前留影',
        '旅游_成都青羊宫“寿”字前留影.jpg', '旅游_成都青羊宫（3）：“寿”字前留影.jpg',
        '旅游_成都青羊宫“寿”字前留影.jpg', 'thumbnails/旅游_成都青羊宫（3）：“寿”字前留影.jpg']
];

console.log(`\n共 ${changes.length} 个改名`);

// 1. 移动 20 个文件
console.log('\n=== 移动 20 个文件 ===');
let moveCount = 0;
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
    moveCount++;
    if (moveCount % 5 === 0) {
        console.log(`  移动进度: ${moveCount}/${changes.length}`);
    }
}
console.log(`  全部 ${moveCount} 个文件已移动`);

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

    const titleRegex = new RegExp(`"title":\\s*"${oldTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`);
    if (!titleRegex.test(oldBlock)) {
        console.error(`❌ id=${id} title 不匹配: ${oldTitle}`);
        process.exit(1);
    }
    newBlock = newBlock.replace(titleRegex, `"title":"${newTitle}"`);

    const thumbRegex = new RegExp(`"thumbnail":\\s*"${oldThumbField.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`);
    if (!thumbRegex.test(oldBlock)) {
        console.error(`❌ id=${id} thumb 不匹配: ${oldThumbField}`);
        process.exit(1);
    }
    newBlock = newBlock.replace(thumbRegex, `"thumbnail":"${newThumbField}"`);

    html = html.replace(oldBlock, newBlock);
}
console.log('  全部 20 个 OK');

fs.writeFileSync('index.html', html, 'utf8');
console.log('\n✅ index.html 已改');

console.log('\n下一步：git add + commit + push');
