// 抓 Cloudflare 完整 HTML 存盘 + 模拟浏览器跑 script 块查错误
const https = require('https');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  console.log('=== 抓 Cloudflare 完整 HTML ===');
  // 用 ?v=now 绕过缓存
  const html = await fetch('https://jianghan-gallery.pages.dev/?v=' + Date.now());
  console.log('HTML 总字符数:', html.length);
  fs.writeFileSync('D:\\AI工作空间\\项目\\江涵-gallery-github\\_cf_full.html', html, 'utf8');
  console.log('已存到 _cf_full.html');

  // 找 script 块
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/g);
  console.log('script 块数:', scriptMatch ? scriptMatch.length : 0);
  if (scriptMatch) {
    scriptMatch.forEach((s, i) => {
      const inner = s.replace(/^<script>/, '').replace(/<\/script>$/, '');
      console.log(`  script[${i}]: ${inner.length} 字符`);
    });
  }

  // 找 works 数组
  const worksKw = html.indexOf('const works =');
  console.log('\n=== works 数组 ===');
  if (worksKw > 0) {
    const arrStart = html.indexOf('[', worksKw);
    let depth = 0, end = -1;
    for (let i = arrStart; i < html.length; i++) {
      if (html[i] === '[') depth++;
      else if (html[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
    }
    const worksText = html.substring(arrStart, end + 1);
    console.log('works 数组字符数:', worksText.length);
    try {
      const works = JSON.parse(worksText.replace(/,(\s*[}\]])/g, '$1'));
      console.log('✓ JSON.parse 成功，works.length =', works.length);
    } catch (e) {
      console.log('❌ JSON.parse 失败:', e.message);
    }
  }

  // 模拟浏览器：用 vm 跑 script 块（提供 mock document/localStorage）
  console.log('\n=== 模拟浏览器跑 script 块 ===');
  // 找主 script 块（包含 const works 的）
  const mainScriptMatch = html.match(/<script>([\s\S]*?const works[\s\S]*?)<\/script>/);
  if (mainScriptMatch) {
    const code = mainScriptMatch[1];
    console.log('主 script 块字符数:', code.length);

    // mock DOM + localStorage
    const mockElement = {
      textContent: '',
      innerHTML: '',
      classList: { add: () => {}, remove: () => {}, contains: () => false },
      style: {},
      dataset: {},
      addEventListener: () => {},
      appendChild: () => {},
      querySelector: () => null,
      querySelectorAll: () => [],
      getAttribute: () => null,
    };
    const mockDocument = {
      getElementById: id => {
        mockElement.textContent = '未跑';
        return mockElement;
      },
      querySelector: () => mockElement,
      querySelectorAll: () => [],
      createElement: () => mockElement,
      addEventListener: () => {},
    };
    const mockLocalStorage = {
      getItem: () => null,
      setItem: () => {},
    };
    const mockWindow = {
      addEventListener: () => {},
      scrollTo: () => {},
    };
    const mockNavigator = { userAgent: 'Node-Test' };
    const mockIntersectionObserver = function() { return { observe: () => {}, unobserve: () => {} }; };
    const mockQrcode = function() { return { addData: () => {}, make: () => {}, createDataURL: () => '' }; };

    const sandbox = {
      document: mockDocument,
      localStorage: mockLocalStorage,
      window: mockWindow,
      navigator: mockNavigator,
      location: { hash: '' },
      IntersectionObserver: mockIntersectionObserver,
      qrcode: mockQrcode,
      console: console,
    };
    sandbox.global = sandbox;
    vm.createContext(sandbox);

    try {
      vm.runInContext(code, sandbox, { filename: 'cloudflare-script.js' });
      console.log('✓ script 块跑完');
      console.log('  total-num.textContent =', mockElement.textContent);
    } catch (e) {
      console.log('❌ script 块报错:', e.message);
      console.log('  stack:', e.stack.split('\n').slice(0, 5).join('\n'));
    }
  }
})();
