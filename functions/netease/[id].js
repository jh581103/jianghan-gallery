export async function onRequest(context) {
  let id = context.params && context.params.id;
  if (!id) {
    return new Response('missing id', { status: 400 });
  }
  // 兼容 /netease/123.mp3 形式（让浏览器/微信把 URL 识别为 mp3 文件）
  id = String(id).replace(/\.mp3$/i, '');
  const target = 'https://music.163.com/song/media/outer/url?id=' + encodeURIComponent(id) + '.mp3';
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
  const ref = 'https://music.163.com/';

  // 用 HEAD 取网易云外层 302 的最新 CDN 直链地址
  let upstream;
  try {
    upstream = await fetch(target, {
      method: 'HEAD',
      redirect: 'manual',
      headers: { 'User-Agent': ua, 'Referer': ref },
    });
  } catch (e) {
    return new Response('upstream error: ' + (e && e.message ? e.message : 'unknown'), { status: 502 });
  }
  let finalUrl = upstream.headers.get('Location');
  if (!finalUrl) {
    return new Response('missing Location header', { status: 502 });
  }
  const httpsUrl = finalUrl.startsWith('http://') ? 'https://' + finalUrl.slice(7) : finalUrl;

  // 返回最新 CDN 直链的 302 跳转，且不允许缓存，每次点击都重新解析最新 URL。
  // Referrer-Policy: no-referrer 让浏览器跳去网易云 CDN 时不带本站 Referer，
  // 绕开网易云对"非 music.163.com Referer"的校验。
  return new Response(null, {
    status: 302,
    headers: {
      'Location': httpsUrl,
      'Referrer-Policy': 'no-referrer',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, private',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
