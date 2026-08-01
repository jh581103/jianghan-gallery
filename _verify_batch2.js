// 验证 push + 看批 3 准备情况
const { execFileSync } = require('child_process');

const repoDir = 'D:\\AI工作空间\\项目\\江涵-gallery-github';
process.chdir(repoDir);

const lsRemote = execFileSync('git', ['ls-remote', 'origin', 'main'], { encoding: 'utf8' });
const remoteHead = lsRemote.split('\t')[0].trim();
const localHead = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
console.log('local:  ' + localHead);
console.log('remote: ' + remoteHead);
console.log(localHead === remoteHead ? '✅ 一致' : '❌ 不一致');

console.log('');
console.log('=== 最近 3 个 commit ===');
execFileSync('git', ['log', '--oneline', '-3'], { stdio: 'inherit' });
