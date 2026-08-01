// 录作品 id=145 - 旅游_成都游铁像寺实拍
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

// 1. thumbnails 目录
const thumbDir = path.join(repoDir, 'thumbnails');

// 2. 复制缩略图
const srcThumb = 'C:\\Users\\HUAWEI\\.minimax\\v2\\assets\\2026\\08\\01\\18-57-33-346-asset_20260801-185733-346_77d530164849_a1bd9ce9-1000044361.jpg';
const destThumb = path.join(thumbDir, '旅游_成都游铁像寺实拍.jpg');
fs.copyFileSync(srcThumb, destThumb);
const stat = fs.statSync(destThumb);
console.log('复制缩略图:', destThumb, '(' + (stat.size / 1024).toFixed(1) + ' KB)');

// 3. 改 index.html
const html = fs.readFileSync('index.html', 'utf8');

const newWork = `    {
      "id": 145,
      "title": "旅游_成都游铁像寺实拍",
      "url": "https://weixin.qq.com/sph/ATUkNNogHp",
      "thumbnail": "thumbnails/旅游_成都游铁像寺实拍.jpg",
      "description": "2023.8.27 成都游铁像寺实拍纪念。",
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

const afterBracket = html.substring(worksIdx);
const firstBraceOffset = afterBracket.indexOf('{');
const firstBraceIdx = worksIdx + firstBraceOffset;

const before = html.substring(0, firstBraceIdx);
const after = html.substring(firstBraceIdx);
const newHtml = before + newWork + ',\n    ' + after;
fs.writeFileSync('index.html', newHtml, 'utf8');
console.log('改 index.html 完成 (id=145)');

// 4. git add + commit + push
try {
    execFileSync('git', ['add', '-A'], { stdio: 'inherit' });
} catch (e) {
    console.error('git add 失败:', e.message);
    process.exit(1);
}

try {
    execFileSync('git', ['commit', '-m', 'id=145 旅游_成都游铁像寺实拍（2023.8.27成都游铁像寺实拍纪念）'], { stdio: 'inherit' });
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
console.log('今天累计成功录入：15 个');
