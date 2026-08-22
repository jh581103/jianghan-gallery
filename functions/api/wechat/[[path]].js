const STATE = 'jianghan';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const appid = env.WECHAT_APPID;
  const secret = env.WECHAT_SECRET;

  if (!appid || !secret) {
    return new Response(
      '<meta charset="utf-8"><body style="font-family:sans-serif;padding:24px;">微信登录尚未配置：需要站长提供「微信开放平台」的 AppID 和 Secret 后才能用。访客目前使用系统自动生成的昵称即可。</body>',
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  // 回调：用 code 换取用户真实昵称 + 头像
  if (url.pathname.endsWith('/callback')) {
    const code = url.searchParams.get('code');
    if (!code) return new Response('授权失败：缺少 code', { status: 400 });
    try {
      const tokenRes = await fetch(
        `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`
      );
      const token = await tokenRes.json();
      if (!token.access_token) {
        return new Response('换取 access_token 失败：' + JSON.stringify(token), { status: 400 });
      }
      const userRes = await fetch(
        `https://api.weixin.qq.com/sns/userinfo?access_token=${token.access_token}&openid=${token.openid}&lang=zh_CN`
      );
      const user = await userRes.json();
      const nickname = (user.nickname || '微信访客').slice(0, 20);
      const headimgurl = user.headimgurl || '';
      const visitor_id = 'wx-' + token.openid;
      await env.DB.prepare('UPDATE guests SET ts = ?, name = ?, avatar = ? WHERE visitor_id = ?')
        .bind(Date.now(), nickname, headimgurl, visitor_id).run();
      await env.DB.prepare('INSERT INTO guests (name, avatar, ts, visitor_id) SELECT ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM guests WHERE visitor_id = ?)')
        .bind(nickname, headimgurl, Date.now(), visitor_id, visitor_id).run();
      const safeName = nickname.replace(/'/g, '');
      return new Response(
        `<meta charset="utf-8"><script>
          try { localStorage.setItem('jh-visitor', JSON.stringify({id:'${visitor_id}',name:'${safeName}',avatar:'${headimgurl}'})); localStorage.setItem('jh-visitor-recorded','1'); } catch(e){}
          location.href='/?wx=1';
        </script>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    } catch (e) {
      return new Response('微信登录出错：' + e.message, { status: 500 });
    }
  }

  // 引导页：302 跳到微信授权
  const redirectUri = encodeURIComponent(new URL('/api/wechat/callback', url.origin).href);
  const authorizeUrl =
    `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}` +
    `&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=${STATE}#wechat_redirect`;
  return new Response(null, { status: 302, headers: { 'Location': authorizeUrl } });
}
