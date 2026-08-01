// 调试：看 id=37 整块 oldBlock 的实际字节
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const blockRegex = /\{[^{}]*?"id":\s*37[^{}]*?\}/;
const match = html.match(blockRegex);
if (match) {
    const oldBlock = match[0];
    console.log('--- oldBlock 长度:', oldBlock.length);
    console.log('--- oldBlock 全部 bytes ---');
    const bytes = Buffer.from(oldBlock, 'utf8');
    for (let i = 0; i < bytes.length; i++) {
        const c = bytes[i];
        const ch = c >= 0x20 && c < 0x7F ? String.fromCharCode(c) : '?';
        const isVisible = (c >= 0x20 && c < 0x7F) || (c >= 0xC0);
        if (c < 0x20 || c === 0x7F) {
            // 控制字符
            if (c === 0x0A) console.log('  [' + i + '] 0x' + c.toString(16).padStart(2,'0') + ' (\\n)');
            else if (c === 0x0D) console.log('  [' + i + '] 0x' + c.toString(16).padStart(2,'0') + ' (\\r)');
            else if (c === 0x09) console.log('  [' + i + '] 0x' + c.toString(16).padStart(2,'0') + ' (\\t)');
            else console.log('  [' + i + '] 0x' + c.toString(16).padStart(2,'0'));
        }
    }
    console.log('');
    console.log('--- "title" 周围（找精确位置）---');
    const titleIdx = oldBlock.indexOf('"title"');
    console.log('"title" 在 oldBlock 位置:', titleIdx);
    if (titleIdx >= 0) {
        const around = oldBlock.substring(titleIdx, titleIdx + 30);
        console.log('周围字符:', JSON.stringify(around));
        console.log('周围 bytes:');
        const aroundBytes = Buffer.from(around, 'utf8');
        for (let i = 0; i < aroundBytes.length; i++) {
            console.log('  [' + i + '] 0x' + aroundBytes[i].toString(16).padStart(2,'0') + ' ' + (around[i] || '?'));
        }
    }

    console.log('');
    console.log('--- 直接 contains 测试 ---');
    const oldTitleStr = '"title": "旅游_三代同游北海银滩 留影"';
    console.log('要找的字符串:', JSON.stringify(oldTitleStr));
    console.log('oldBlock 包含它?:', oldBlock.includes(oldTitleStr));
    if (!oldBlock.includes(oldTitleStr)) {
        // 找每个字符位置
        console.log('--- 逐字符比对 ---');
        const searchStr = '旅游_三代同游北海银滩 留影';
        const foundIdx = oldBlock.indexOf(searchStr);
        console.log('  搜索 "' + searchStr + '" 位置:', foundIdx);
        if (foundIdx >= 0) {
            // 显示前 5 个和后 5 个字符
            console.log('  前 5 字符:', JSON.stringify(oldBlock.substring(foundIdx - 5, foundIdx)));
            console.log('  后 5 字符:', JSON.stringify(oldBlock.substring(foundIdx + searchStr.length, foundIdx + searchStr.length + 5)));
        }
    }
}
