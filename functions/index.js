// 根据 ?cat= 参数动态改写 index.html 的 <title> 与 OG 分享标题，
// 让分享给朋友/朋友圈时卡片标题显示具体类目（如"江涵发光的蛋糕 — 读悟"）。
export async function onRequest(context) {
  const url = new URL(context.request.url);

  // 只处理根路径；其它路径走静态资源
  if (url.pathname !== '/') {
    return context.next();
  }

  const cat = url.searchParams.get('cat');

  // 拉取静态 index.html 内容
  let response;
  try {
    response = await context.env.ASSETS.fetch(new URL('/index.html', url).toString());
  } catch (e) {
    return new Response('asset fetch error: ' + (e.message || 'unknown'), { status: 502 });
  }

  // 有效大类目白名单（与 index.html 中的 sectionMap 对齐）
  const validCats = [
    '国学经典','乐器习作','书画练笔','歌唱声韵','诵读声韵','哲思',
    '江涵原创','伴奏','爱篇分赏','日常','旅游','美食','养生','AI制作','读悟','常识'
  ];

  // 默认（无 cat / 全部 / 非法类目）直接返回原页面，但强制 no-store，
  // 防止微信/浏览器长期缓存旧 HTML（导致旧 JS 一直生效、播放器修不好）
  const noStoreHeaders = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };
  const returnNoStore = () => new Response(response.body, {
    status: response.status,
    headers: { ...Object.fromEntries(response.headers), ...noStoreHeaders },
  });
  if (!cat || cat === 'all' || !validCats.includes(cat)) {
    return returnNoStore();
  }

  const title = '江涵发光的蛋糕 — ' + cat;
  let html = await response.text();

  // 精确替换头部标题与 OG / Twitter 标题（保留其它所有 meta 不变）
  html = html.replace(/<title>.*?<\/title>/, '<title>' + title + '</title>');
  html = html.replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + title + '">');
  html = html.replace(/<meta name="twitter:title" content="[^"]*">/, '<meta name="twitter:title" content="' + title + '">');

  return new Response(html, {
    status: response.status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
