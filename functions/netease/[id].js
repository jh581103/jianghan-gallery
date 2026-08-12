export async function onRequest(context) {
  const id = context.params && context.params.id;
  if (!id) {
    return new Response('missing id', { status: 400 });
  }
  const target = 'https://music.163.com/song/media/outer/url?id=' + encodeURIComponent(id) + '.mp3';
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
  const ref = 'https://music.163.com/';

  // 1) 先用 HEAD 取网易云外层 302 的真实 CDN 地址
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

  // 2) 同域代理：浏览器只跟本站通信，本站带正确 Referer 去网易云拉流再回传，
  //    彻底绕开浏览器直连 CDN 时的 Referer/跨域校验；透传 Range 使进度条可拖。
  const range = context.request.headers.get('Range');
  const reqHeaders = { 'User-Agent': ua, 'Referer': ref };
  if (range) reqHeaders['Range'] = range;
  let audio;
  try {
    audio = await fetch(httpsUrl, { headers: reqHeaders, redirect: 'follow' });
  } catch (e) {
    return new Response('audio fetch error: ' + (e && e.message ? e.message : 'unknown'), { status: 502 });
  }
  const out = {
    'Content-Type': audio.headers.get('Content-Type') || 'audio/mpeg',
    'Access-Control-Allow-Origin': '*',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };
  for (const h of ['Content-Length', 'Content-Range', 'ETag', 'Last-Modified']) {
    const v = audio.headers.get(h);
    if (v) out[h] = v;
  }
  return new Response(audio.body, { status: audio.status, headers: out });
}
