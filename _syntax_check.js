// 提取 script 块到临时文件，node --check 验证 syntax
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const html = fs.readFileSync(path.join('D:\\AI工作空间\\项目\\江涵-gallery-github', 'index.html'), 'utf8');
const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];
fs.writeFileSync(path.join('D:\\AI工作空间\\项目\\江涵-gallery-github', '_tmp.js'), code, 'utf8');
try {
  execFileSync('node', ['--check', path.join('D:\\AI工作空间\\项目\\江涵-gallery-github', '_tmp.js')], { stdio: 'inherit' });
  console.log('✓ script 块 syntax OK');
} catch (e) {
  console.log('❌ script 块 syntax 错:', e.message);
}
fs.unlinkSync(path.join('D:\\AI工作空间\\项目\\江涵-gallery-github', '_tmp.js'));
