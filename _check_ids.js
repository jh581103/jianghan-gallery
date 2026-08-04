// 看真正的 works 数组里 id=194
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// 找 const works = [ 后面
const worksKw = html.indexOf('const works =');
const arrStart = html.indexOf('[', worksKw);
console.log('works 数组开始位置:', arrStart);

// 在 works 数组里找 id=194
const re = /"id":\s*(\d+)/g;
let m;
const ids = [];
while ((m = re.exec(html)) !== null) {
  if (m.index > arrStart) {
    ids.push({id: parseInt(m[1]), pos: m.index});
  }
}
console.log('works 数组里所有 id:');
ids.forEach(p => console.log('  id=' + p.id + ' at ' + p.pos));
console.log('---');
// 找 id=194
const id194 = ids.find(p => p.id === 194);
if (id194) {
  console.log('id=194 上下文:');
  console.log(html.substring(id194.pos - 80, id194.pos + 250));
}
