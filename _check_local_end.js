// 看本地 index.html 的 works 数组结尾 + 跑 script 块看是否报错
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join('D:\\AI工作空间\\项目\\江涵-gallery-github', 'index.html'), 'utf8');
const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];

// 找 works 数组结尾
const worksKw = code.indexOf('const works =');
const arrStart = code.indexOf('[', worksKw);
let depth = 0, arrEnd = -1;
for (let i = arrStart; i < code.length; i++) {
  if (code[i] === '[') depth++;
  else if (code[i] === ']') { depth--; if (depth === 0) { arrEnd = i; break; } }
}
console.log('works 数组 arrEnd =', arrEnd);
console.log('arrEnd 附近 200 字符:');
console.log(code.substring(arrEnd - 100, arrEnd + 100));
console.log('---END---');

// 跑 script 块（mock DOM）看是否报错
const vm = require('vm');
const mockElement = {
  textContent: 'mock', innerHTML: '',
  classList: { add: () => {}, remove: () => {}, contains: () => false },
  style: {}, dataset: {},
  addEventListener: () => {}, appendChild: () => {},
  querySelector: () => mockElement, querySelectorAll: () => [],
};
const mockDocument = {
  getElementById: () => mockElement,
  querySelector: () => mockElement,
  querySelectorAll: () => [],
  createElement: () => mockElement,
  addEventListener: () => {},
};
const sandbox = {
  document: mockDocument, localStorage: { getItem: () => null, setItem: () => {} },
  window: { addEventListener: () => {}, scrollTo: () => {} },
  navigator: { userAgent: 'Node' },
  location: { hash: '' },
  IntersectionObserver: function() { return { observe: () => {}, unobserve: () => {} }; },
  qrcode: function() { return { addData: () => {}, make: () => {}, createDataURL: () => '' }; },
  console: console,
};
sandbox.global = sandbox;
vm.createContext(sandbox);
try {
  vm.runInContext(code, sandbox, { filename: 'local-script.js' });
  console.log('✓ 本地 script 块跑完');
} catch (e) {
  console.log('❌ 本地 script 块报错:', e.message);
  console.log('  stack:', e.stack.split('\n').slice(0, 5).join('\n'));
}
