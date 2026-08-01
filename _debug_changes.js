// 调试 v3 脚本里的 changes 数组 - 看 oldTitle 实际值
const fs = require('fs');
const path = require('path');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
process.chdir(repoDir);

// 直接从 v3 脚本 require changes 数组
const scriptContent = fs.readFileSync('_rename_batch1_v3.js', 'utf8');
// 提取 changes 数组
const changesMatch = scriptContent.match(/const changes = (\[[\s\S]*?\]);/);
if (changesMatch) {
    const changesStr = changesMatch[1];
    // 评估（危险！仅在可信脚本中使用）
    const changes = eval(changesMatch[1]);
    console.log('changes 数组长度:', changes.length);
    console.log('');
    console.log('--- id=37 (changes[0]) ---');
    const id37 = changes[0];
    console.log('id:', id37[0]);
    console.log('oldTitle:', JSON.stringify(id37[1]));
    console.log('  bytes:', Buffer.from(id37[1], 'utf8').toString('hex'));
    console.log('newTitle:', JSON.stringify(id37[2]));
    console.log('  bytes:', Buffer.from(id37[2], 'utf8').toString('hex'));
    console.log('oldRootFile:', JSON.stringify(id37[3]));
    console.log('newThumbFile:', JSON.stringify(id37[4]));
    console.log('oldThumbField:', JSON.stringify(id37[5]));
    console.log('newThumbField:', JSON.stringify(id37[6]));

    console.log('');
    console.log('--- 对比 index.html 里 id=37 ---');
    const html = fs.readFileSync('index.html', 'utf8');
    const m = html.match(/"title":\s*"(旅游_三代同游北海银滩[^"]+留影)"/);
    if (m) {
        const htmlTitle = m[1];
        console.log('html title:', JSON.stringify(htmlTitle));
        console.log('  bytes:', Buffer.from(htmlTitle, 'utf8').toString('hex'));
        console.log('');
        console.log('oldTitle === htmlTitle:', id37[1] === htmlTitle);
        if (id37[1] !== htmlTitle) {
            console.log('差异位置:');
            for (let i = 0; i < Math.max(id37[1].length, htmlTitle.length); i++) {
                if (id37[1][i] !== htmlTitle[i]) {
                    console.log('  index ' + i + ': JS=' + JSON.stringify(id37[1][i]) + ' HTML=' + JSON.stringify(htmlTitle[i]));
                }
            }
        }
    }
}
