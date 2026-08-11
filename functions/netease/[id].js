export async function onRequest(context) {
  const id = context.params && context.params.id;
  if (!id) {
    return new Response('missing id', { status: 400 });
  }
  const target = 'https://music.163.com/song/media/outer/url?id=' + encodeURIComponent(id) + '.mp3';
  let upstream;
  try {
    // 用 HEAD + 手动跟随 302，避免在服务端下载整个音频文件，只取最终 CDN 地址
    upstream = await fetch(target, {
      method: 'HEAD',
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Referer': 'https://music.163.com/',
      },
    });
  } catch (e) {
    return new Response('upstream error: ' + (e && e.message ? e.message : 'unknown'), { status: 502 });
  }
  // NetEase 外层返回 302 Location，直接提取最终 CDN 地址
  let finalUrl = upstream.headers.get('Location');
  if (!finalUrl) {
    return new Response('missing Location header', { status: 502 });
  }
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
