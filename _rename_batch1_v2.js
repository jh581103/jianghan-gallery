// 批 1 (调整): 北海银滩 + 泸定桥 = 10 个作品加序号
// id=120-127 西溪云间的缩略图在仓库根目录（workbuddy 当时传的），不在 thumbnails/，先避开
// 只改 title + thumbnail，description 不动
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

// 10 个改名数据：[id, oldTitle, newTitle, oldThumb, newThumb]
const changes = [
    // ===== 组 1: 北海银滩 (id=37, 44, 46, 49, 50) =====
    [37, '旅游_三代同游北海银滩 留影', '旅游_北海银滩（1）：三代同游留影',
        'thumbnails/旅游_三代同游北海银滩 留影.jpg', 'thumbnails/旅游_北海银滩（1）：三代同游留影.jpg'],
    [44, '旅游_北海银滩皇冠假日酒店游泳池留影', '旅游_北海银滩（2）：皇冠假日酒店游泳池留影',
        'thumbnails/旅游_北海银滩皇冠假日酒店游泳池留影.jpg', 'thumbnails/旅游_北海银滩（2）：皇冠假日酒店游泳池留影.jpg'],
    [46, '旅游_广西南宁北海银滩皇冠假日酒店留影', '旅游_北海银滩（3）：皇冠假日酒店留影',
        'thumbnails/旅游_广西南宁北海银滩皇冠假日酒店留影.jpg', 'thumbnails/旅游_北海银滩（3）：皇冠假日酒店留影.jpg'],
    [49, '旅游_北海银滩留影', '旅游_北海银滩（4）：留影',
        'thumbnails/旅游_北海银滩留影.jpg', 'thumbnails/旅游_北海银滩（4）：留影.jpg'],
    [50, '旅游_皇冠假日酒店浴袍留影', '旅游_北海银滩（5）：皇冠假日酒店浴袍留影',
        'thumbnails/旅游_皇冠假日酒店浴袍留影.jpg', 'thumbnails/旅游_北海银滩（5）：皇冠假日酒店浴袍留影.jpg'],

    // ===== 组 2: 泸定桥 (id=93-97) =====
    [93, '旅游_"八·一"游泸定桥（上）', '旅游_泸定桥（1）："八·一"游泸定桥（上）',
        'thumbnails/旅游_"八·一"游泸定桥（上）.jpg', 'thumbnails/旅游_泸定桥（1）："八·一"游泸定桥（上）.jpg'],
    [94, '旅游_"八·一"游泸定桥（中）', '旅游_泸定桥（2）："八·一"游泸定桥（中）',
        'thumbnails/旅游_"八·一"游泸定桥（中）.jpg', 'thumbnails/旅游_泸定桥（2）："八·一"游泸定桥（中）.jpg'],
    [95, '旅游_"八·一"泸定桥留影（下）', '旅游_泸定桥（3）："八·一"游泸定桥留影（下）',
        'thumbnails/旅游_"八·一"泸定桥留影（下）.jpg', 'thumbnails/旅游_泸定桥（3）："八·一"游泸定桥留影（下）.jpg'],
    [96, '旅游_过泸定桥之思考', '旅游_泸定桥（4）：过泸定桥之思考',
        'thumbnails/旅游_过泸定桥之思考.jpg', 'thumbnails/旅游_泸定桥（4）：过泸定桥之思考.jpg'],
    [97, '旅游_泸定桥上留个影', '旅游_泸定桥（5）：桥上留个影',
        'thumbnails/旅游_泸定桥上留个影.jpg', 'thumbnails/旅游_泸定桥（5）：桥上留个影.jpg']
];

console.log(`\n共 ${changes.length} 个改名`);

// 1. 复制 10 个旧缩略图为新名
console.log('\n=== 复制 10 个新缩略图 ===');
for (const [id, oldTitle, newTitle, oldThumb, newThumb] of changes) {
    const oldPath = path.join(repoDir, oldThumb);
    const newPath = path.join(repoDir, newThumb);
    if (!fs.existsSync(oldPath)) {
        console.error(`❌ 旧缩略图不存在: ${oldPath}`);
        process.exit(1);
    }
    fs.copyFileSync(oldPath, newPath);
    const stat = fs.statSync(newPath);
    console.log(`  id=${id}: ${(stat.size / 1024).toFixed(1)} KB`);
}

// 2. 改 index.html（每个 id 精确替换 title 和 thumbnail 字段）
console.log('\n=== 改 index.html ===');
let html = fs.readFileSync('index.html', 'utf8');

for (const [id, oldTitle, newTitle, oldThumb, newThumb] of changes) {
    // 找 id 整块
    const blockRegex = new RegExp(`\\{[^{}]*?"id":\\s*${id}[^{}]*?\\}`);
    const match = html.match(blockRegex);
    if (!match) {
        console.error(`❌ 未找到 id=${id} 整块`);
        process.exit(1);
    }

    const oldBlock = match[0];
    let newBlock = oldBlock;

    // 替换 title
    if (!oldBlock.includes(`"title": "${oldTitle}"`)) {
        console.error(`❌ id=${id} title 不匹配: 期望 "${oldTitle}"`);
        process.exit(1);
    }
    newBlock = newBlock.replace(`"title": "${oldTitle}"`, `"title": "${newTitle}"`);

    // 替换 thumbnail
    if (!oldBlock.includes(`"thumbnail": "${oldThumb}"`)) {
        console.error(`❌ id=${id} thumbnail 不匹配: 期望 "${oldThumb}"`);
        process.exit(1);
    }
    newBlock = newBlock.replace(`"thumbnail": "${oldThumb}"`, `"thumbnail": "${newThumb}"`);

    html = html.replace(oldBlock, newBlock);
    console.log(`  id=${id} OK`);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('\n✅ index.html 已改');

console.log('\n下一步：PowerShell 删 10 个旧缩略图 + commit + push');
