// 改 id=135 - 改名：旅游_参观张飞庙实拍 → 旅游_阆中之旅（2）:参观张飞庙实拍
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

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

// 1. 改前准备
const thumbDir = path.join(repoDir, 'thumbnails');
const oldThumb = path.join(thumbDir, '旅游_参观张飞庙实拍.jpg');
const newThumb = path.join(thumbDir, '旅游_阆中之旅（2）:参观张飞庙实拍.jpg');

// 2. 复制旧缩略图为新名（用 fs.copyFileSync 不用重下）
fs.copyFileSync(oldThumb, newThumb);
const newStat = fs.statSync(newThumb);
console.log('复制缩略图:', newThumb, '(' + (newStat.size / 1024).toFixed(1) + ' KB)');

// 3. 改 index.html（id=135 的 title + thumbnail 字段）
let html = fs.readFileSync('index.html', 'utf8');

const oldEntry = `{
      "id": 135,
      "title": "旅游_参观张飞庙实拍",
      "url": "https://weixin.qq.com/sph/ARMZsi5gvg",
      "thumbnail": "thumbnails/旅游_参观张飞庙实拍.jpg",
      "description": "2023.8.24 下午参观张飞庙实拍纪念。",`;

const newEntry = `{
      "id": 135,
      "title": "旅游_阆中之旅（2）:参观张飞庙实拍",
      "url": "https://weixin.qq.com/sph/ARMZsi5gvg",
      "thumbnail": "thumbnails/旅游_阆中之旅（2）:参观张飞庙实拍.jpg",
      "description": "2023.8.24 下午参观张飞庙实拍纪念。",`;

if (!html.includes(oldEntry)) {
    console.error('❌ 未找到 id=135 旧条目，原文未动');
    process.exit(1);
}

html = html.replace(oldEntry, newEntry);
fs.writeFileSync('index.html', html, 'utf8');
console.log('改 index.html 完成 (id=135 title + thumbnail)');

// 4. mavis-trash 旧缩略图
const trashResult = spawnSync('C:\\Users\\HUAWEI\\.minimax\\bin\\mavis-trash.cmd', [oldThumb], { encoding: 'utf8' });
console.log('mavis-trash 旧缩略图:', trashResult.stdout.trim() || trashResult.stderr.trim());
if (trashResult.status !== 0) {
    console.error('⚠️ mavis-trash 失败，但 index.html 已改，继续 commit');
}

// 5. git add + commit + push
try {
    execFileSync('git', ['add', '-A'], { stdio: 'inherit' });
} catch (e) {
    console.error('git add 失败:', e.message);
    process.exit(1);
}

try {
    execFileSync('git', ['commit', '-m', 'id=135 改名：旅游_参观张飞庙实拍 → 旅游_阆中之旅（2）:参观张飞庙实拍（缩略图同步改名）'], { stdio: 'inherit' });
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

// 6. git ls-remote 验证
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
console.log('id=135 改名完成。');
console.log('今天累计成功录入：5 个（改名不算新作品）');
