export async function onRequest(context) {
  const id = context.params && context.params.id;
  if (!id) {
    return new Response('missing id', { status: 400 });
  }
  const target = 'https://music.163.com/song/media/outer/url?id=' + encodeURIComponent(id) + '.mp3';
  let upstream;
  try {
    upstream = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Referer': 'https://music.163.com/',
      },
    });
  } catch (e) {
    return new Response('upstream error: ' + (e && e.message ? e.message : 'unknown'), { status: 502 });
  }
  // upstream.url 已是跟随 302 后的最终地址（含时间戳签名的 CDN 链接）
  const finalUrl = upstream.url;
  if (!finalUrl || finalUrl.indexOf('music.126.net') === -1) {
    return new Response('unexpected upstream url', { status: 502 });
  }
  // NetEase 返回的是 http，改写为 https，避免混合内容被浏览器拦截
  const httpsUrl = finalUrl.startsWith('http://') ? 'https://' + finalUrl.slice(7) : finalUrl;
  return new Response(null, {
    status: 302,
    headers: {
      'Location': httpsUrl,
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
