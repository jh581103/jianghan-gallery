// 批 1 v3: 北海银滩 5 + 泸定桥 5 = 10 个作品
// 1) 移动缩略图: 仓库根 → thumbnails/
// 2) 改 index.html: title + thumb 字段（加 thumbnails/ 前缀 + 序号）
// 3) description 不动
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
// oldRootFile: 仓库根旧文件名（要移动的源）
// newThumbFile: thumbnails/ 新文件名（要移动的目标）
// oldThumbField: index.html 里 thumbnail 字段的当前值（裸文件名）
// newThumbField: index.html 里 thumbnail 字段的新值（thumbnails/xxx）
const changes = [
    // ===== 北海银滩 =====
    [37,
        '旅游_三代同游北海银滩 留影', '旅游_北海银滩（1）：三代同游留影',
        '三代同游北海银滩 留影.png', '旅游_北海银滩（1）：三代同游留影.png',
        '三代同游北海银滩 留影.png', 'thumbnails/旅游_北海银滩（1）：三代同游留影.png'],
    [44,
        '旅游_北海银滩皇冠假日酒店游泳池留影', '旅游_北海银滩（2）：皇冠假日酒店游泳池留影',
        '旅游_北海银滩皇冠假日酒店游泳池留影.jpg', '旅游_北海银滩（2）：皇冠假日酒店游泳池留影.jpg',
        '旅游_北海银滩皇冠假日酒店游泳池留影.jpg', 'thumbnails/旅游_北海银滩（2）：皇冠假日酒店游泳池留影.jpg'],
    [46,
        '旅游_广西南宁北海银滩皇冠假日酒店留影', '旅游_北海银滩（3）：皇冠假日酒店留影',
        '旅游_广西南宁北海银滩皇冠假日酒店留影.jpg', '旅游_北海银滩（3）：皇冠假日酒店留影.jpg',
        '旅游_广西南宁北海银滩皇冠假日酒店留影.jpg', 'thumbnails/旅游_北海银滩（3）：皇冠假日酒店留影.jpg'],
    [49,
        '旅游_北海银滩留影', '旅游_北海银滩（4）：留影',
        '旅游_北海银滩留影.jpg', '旅游_北海银滩（4）：留影.jpg',
        '旅游_北海银滩留影.jpg', 'thumbnails/旅游_北海银滩（4）：留影.jpg'],
    [50,
        '旅游_皇冠假日酒店浴袍留影', '旅游_北海银滩（5）：皇冠假日酒店浴袍留影',
        '旅游_皇冠假日酒店浴袍留影.jpg', '旅游_北海银滩（5）：皇冠假日酒店浴袍留影.jpg',
        '旅游_皇冠假日酒店浴袍留影.jpg', 'thumbnails/旅游_北海银滩（5）：皇冠假日酒店浴袍留影.jpg'],

    // ===== 泸定桥 =====
    [93,
        '旅游_“八·一”游泸定桥（上）', '旅游_泸定桥（1）：“八·一”游泸定桥（上）',
        '旅游_“八·一”游泸定桥（上）.jpg', '旅游_泸定桥（1）：“八·一”游泸定桥（上）.jpg',
        '旅游_“八·一”游泸定桥（上）.jpg', 'thumbnails/旅游_泸定桥（1）：“八·一”游泸定桥（上）.jpg'],
    [94,
        '旅游_“八·一”游泸定桥（中）', '旅游_泸定桥（2）：“八·一”游泸定桥（中）',
        '旅游_“八·一”游泸定桥（中）.jpg', '旅游_泸定桥（2）：“八·一”游泸定桥（中）.jpg',
        '旅游_“八·一”游泸定桥（中）.jpg', 'thumbnails/旅游_泸定桥（2）：“八·一”游泸定桥（中）.jpg'],
    [95,
        '旅游_“八·一”泸定桥留影（下）', '旅游_泸定桥（3）：“八·一”游泸定桥留影（下）',
        '旅游_“八·一”泸定桥留影（下）.jpg', '旅游_泸定桥（3）：“八·一”游泸定桥留影（下）.jpg',
        '旅游_“八·一”泸定桥留影（下）.jpg', 'thumbnails/旅游_泸定桥（3）：“八·一”游泸定桥留影（下）.jpg'],
    [96,
        '旅游_过泸定桥之思考', '旅游_泸定桥（4）：过泸定桥之思考',
        '旅游_过泸定桥之思考.jpg', '旅游_泸定桥（4）：过泸定桥之思考.jpg',
        '旅游_过泸定桥之思考.jpg', 'thumbnails/旅游_泸定桥（4）：过泸定桥之思考.jpg'],
    [97,
        '旅游_泸定桥上留个影', '旅游_泸定桥（5）：桥上留个影',
        '旅游_泸定桥上留个影.jpg', '旅游_泸定桥（5）：桥上留个影.jpg',
        '旅游_泸定桥上留个影.jpg', 'thumbnails/旅游_泸定桥（5）：桥上留个影.jpg']
];

console.log(`\n共 ${changes.length} 个改名`);

// 1. 移动 10 个文件：仓库根 → thumbnails/
console.log('\n=== 移动 10 个文件 ===');
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
    console.log(`  id=${id}: ${oldRootFile} → ${newThumbFile} (${(stat.size / 1024).toFixed(1)} KB)`);
}

// 2. 改 index.html（每个 id 精确替换 title 和 thumbnail 字段）
console.log('\n=== 改 index.html ===');
let html = fs.readFileSync('index.html', 'utf8');

for (const [id, oldTitle, newTitle, oldRootFile, newThumbFile, oldThumbField, newThumbField] of changes) {
    // 找 id 整块
    const blockRegex = new RegExp(`\\{[^{}]*?"id":\\s*${id}[^{}]*?\\}`);
    const match = html.match(blockRegex);
    if (!match) {
        console.error(`❌ 未找到 id=${id} 整块`);
        process.exit(1);
    }

    const oldBlock = match[0];
    let newBlock = oldBlock;

    // 替换 title（workbuddy 录的格式是 "title":"..."，无空格；我录的是 "title": "..."，有空格）
    // 兼容两种：用正则匹配
    const titleRegex = new RegExp(`"title":\\s*"${oldTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`);
    if (!titleRegex.test(oldBlock)) {
        console.error(`❌ id=${id} title 不匹配: ${oldTitle}`);
        process.exit(1);
    }
    newBlock = newBlock.replace(titleRegex, `"title":"${newTitle}"`);

    // 替换 thumbnail（同理）
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

console.log('\n下一步：git add + commit + push（git 会自动检测 rename）');
