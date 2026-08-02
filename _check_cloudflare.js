// 抓 Cloudflare 实际 HTML 验证 works 数组是否能 parse
const https = require('https');

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
  // 用 ?v=2 绕过 Cloudflare 缓存
  const html = await fetch('https://jianghan-gallery.pages.dev/?v=2');

  // 找 works 数组
  const worksKw = html.indexOf('const works =');
  if (worksKw < 0) {
    console.log('❌ 找不到 const works');
    return;
  }
  // 找 [
  const arrStart = html.indexOf('[', worksKw);
  // 找 ]（注意可能有嵌套）
  let depth = 0, end = -1;
  for (let i = arrStart; i < html.length; i++) {
    if (html[i] === '[') depth++;
    else if (html[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
  }
  const worksText = html.substring(arrStart, end + 1);
  console.log('Cloudflare works 数组总字符数:', worksText.length);

  // 尝试 parse
  try {
    const works = JSON.parse(worksText.replace(/,(\s*[}\]])/g, '$1'));
    console.log('✓ JSON.parse 成功');
    console.log('  works 数:', works.length);
    console.log('  最大 id:', Math.max(...works.map(w => w.id)));
  } catch (e) {
    console.log('❌ JSON.parse 失败:', e.message);
    // 找错误位置附近的内容
    const m = e.message.match(/position (\d+)/);
    if (m) {
      const pos = parseInt(m[1]);
      const start = Math.max(0, pos - 100);
      const end2 = Math.min(worksText.length, pos + 100);
      console.log('错误位置附近:', worksText.substring(start, end2));
    } else {
      console.log('前 500 字:', worksText.substring(0, 500));
      console.log('后 500 字:', worksText.substring(worksText.length - 500));
    }
  }

  // 看 HTML 里 hardcode 的 total-num 值
  const m = html.match(/<span class="stat-num" id="total-num">(\d+)<\/span>/);
  if (m) console.log('HTML hardcode total-num:', m[1]);

  // 找 script 块的语法
  const scriptEnd = html.lastIndexOf('</script>');
  console.log('script 块总长:', scriptEnd - worksKw);
})();
