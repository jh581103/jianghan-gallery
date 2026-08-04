// 检查 id 在文件中的实际顺序
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const re = /"id":\s*(\d+)/g;
const positions = [];
let m;
while ((m = re.exec(html)) !== null) {
  positions.push({id: parseInt(m[1]), pos: m.index});
}
// 按 position 排序
positions.sort((a, b) => a.pos - b.pos);
console.log('id 顺序 (按文件位置) - 最后 10 个:');
positions.slice(-10).forEach(p => console.log('  ' + p.id + ' at ' + p.pos));
console.log('---');
console.log('id=189 位置:', positions.find(p => p.id === 189)?.pos);
console.log('id=190 位置:', positions.find(p => p.id === 190)?.pos);
console.log('id=191 位置:', positions.find(p => p.id === 191)?.pos);
console.log('id=192 位置:', positions.find(p => p.id === 192)?.pos);
console.log('id=193 位置:', positions.find(p => p.id === 193)?.pos);
console.log('id=194 位置:', positions.find(p => p.id === 194)?.pos);
// 找 id=194 周围 (前后各 3 个)
const idx194 = positions.findIndex(p => p.id === 194);
console.log('---');
console.log('id=194 周围:');
positions.slice(Math.max(0, idx194 - 3), idx194 + 4).forEach(p => console.log('  ' + p.id + ' at ' + p.pos));
