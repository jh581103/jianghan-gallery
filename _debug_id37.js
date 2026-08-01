// 调试：对比 .js 里的字符串和 index.html 里的字符串
const fs = require('fs');
const jsContent = fs.readFileSync('_rename_batch1_v3.js', 'utf8');
const htmlContent = fs.readFileSync('index.html', 'utf8');

// 找 .js 里 id=37 那行的 oldTitle
console.log('--- .js 脚本里 id=37 的 oldTitle ---');
const m1 = jsContent.match(/'旅游_三代同游北海银滩[^']*留影'/);
if (m1) {
    const bytes = Buffer.from(m1[0], 'utf8');
    console.log('字符串:', JSON.stringify(m1[0]));
    console.log('bytes:');
    for (let i = 0; i < bytes.length; i++) {
        console.log('  [' + i + '] 0x' + bytes[i].toString(16).padStart(2, '0'));
    }
}

console.log('');
console.log('--- index.html 里 id=37 的 title 字段 ---');
const m2 = htmlContent.match(/"title":\s*"(旅游_三代同游北海银滩[^"]+留影)"/);
if (m2) {
    const bytes = Buffer.from(m2[1], 'utf8');
    console.log('title:', JSON.stringify(m2[1]));
    console.log('bytes:');
    for (let i = 0; i < bytes.length; i++) {
        console.log('  [' + i + '] 0x' + bytes[i].toString(16).padStart(2, '0'));
    }
}

console.log('');
console.log('--- 比对 ---');
if (m1 && m2) {
    console.log('JS len:', m1[0].length, 'HTML len:', m2[1].length);
    if (m1[0] === m2[1]) {
        console.log('字符串完全相同');
    } else {
        console.log('字符串不同!');
        const jBytes = Buffer.from(m1[0], 'utf8');
        const hBytes = Buffer.from(m2[1], 'utf8');
        console.log('JS bytes len:', jBytes.length, 'HTML bytes len:', hBytes.length);
    }
}
