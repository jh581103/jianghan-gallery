// 录作品 id=131 - 旅游_成都望丛祠留影
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
process.chdir(repoDir);

// 1. 建 thumbnails 目录
const thumbDir = path.join(repoDir, 'thumbnails');
if (!fs.existsSync(thumbDir)) {
    fs.mkdirSync(thumbDir, { recursive: true });
    console.log('创建 thumbnails 目录');
}

// 2. 复制缩略图
const srcThumb = 'C:\\Users\\HUAWEI\\.minimax\\v2\\assets\\2026\\08\\01\\16-32-56-411-asset_20260801-163256-411_d3358d83621d_95593669-1000044318.jpg';
const destThumb = path.join(thumbDir, '旅游_成都望丛祠留影.jpg');
fs.copyFileSync(srcThumb, destThumb);
const stat = fs.statSync(destThumb);
console.log('复制缩略图:', destThumb, '(' + (stat.size / 1024).toFixed(1) + ' KB)');

// 3. 改 index.html
const html = fs.readFileSync('index.html', 'utf8');

const newWork = `    {
      "id": 131,
      "title": "旅游_成都望丛祠留影",
      "url": "https://weixin.qq.com/sph/Av1ydPv26J",
      "thumbnail": "thumbnails/旅游_成都望丛祠留影.jpg",
      "description": "2023.8.18 成都望丛祠前留影纪念",
      "tags": ["江涵原创", "旅游", "视频"],
      "medium": "视频",
      "platform": "视频号",
      "publishDate": "2026-08-01",
      "status": "已发布"
    }`;

// 找 'const works = ['
const worksMatch = html.match(/const\s+works\s*=\s*\[/);
if (!worksMatch) {
    console.error('未找到 works 数组');
    process.exit(1);
}
const worksIdx = worksMatch.index + worksMatch[0].length;

// 找 '[' 后第一个 '{'
const afterBracket = html.substring(worksIdx);
const firstBraceOffset = afterBracket.indexOf('{');
const firstBraceIdx = worksIdx + firstBraceOffset;

const before = html.substring(0, firstBraceIdx);
const after = html.substring(firstBraceIdx);
const newHtml = before + newWork + ',\n    ' + after;
fs.writeFileSync('index.html', newHtml, 'utf8');
console.log('改 index.html 完成 (id=131)');

// 4. git add + commit + push
try {
    execFileSync('git', ['add', '-A'], { stdio: 'inherit' });
} catch (e) {
    console.error('git add 失败:', e.message);
    process.exit(1);
}

try {
    execFileSync('git', ['commit', '-m', 'id=131 旅游_成都望丛祠留影（2023.8.18成都望丛祠前留影纪念）'], { stdio: 'inherit' });
} catch (e) {
    console.error('git commit 失败:', e.message);
    process.exit(1);
}

try {
    execFileSync('git', ['push', 'origin', 'main'], { stdio: 'inherit' });
} catch (e) {
    console.error('git push 失败:', e.message);
    // 不立即退出，先验证 remote
}

// 5. git ls-remote 验证
console.log('');
console.log('=== 验证 remote ===');
const lsRemote = execFileSync('git', ['ls-remote', 'origin', 'main'], { encoding: 'utf8' });
const remoteHead = lsRemote.split('\t')[0].trim();
const localHead = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
console.log('local HEAD:', localHead);
console.log('remote HEAD:', remoteHead);
if (localHead === remoteHead) {
    console.log('✅ push 验证成功');
} else {
    console.log('❌ push 验证失败 - local != remote');
    process.exit(1);
}

console.log('');
console.log('今天累计成功录入：1 个');
