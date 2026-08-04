// 检查 Cloudflare 部署状态
const https = require('https');
https.get('https://jianghan-gallery.pages.dev/', (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('statusCode:', res.statusCode);
    console.log('body length:', body.length);
    console.log('content-encoding:', res.headers['content-encoding'] || 'none');
    const idx = body.indexOf('"id": 172');
    console.log('id=172 found at:', idx);
    if (idx >= 0) {
      console.log('--- id=172 周围 ---');
      console.log(body.substring(idx, idx + 500));
    }
    console.log('---');
    console.log('新 title 在:', body.indexOf('旅游_成都国庆（1）：川剧表演') >= 0);
    console.log('老 title 在:', body.indexOf('旅游_成都国庆川剧表演') >= 0);
    const ids = body.match(/"id":\s*\d+/g) || [];
    console.log('总作品数:', ids.length);
    console.log('前 3 个 id:', ids.slice(0, 3).join(','));
    console.log('后 3 个 id:', ids.slice(-3).join(','));
  });
}).on('error', (e) => console.log('error:', e.message));
