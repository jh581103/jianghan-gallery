// Cloudflare Pages Function: 分享计数
// 路由：/api/share
//   GET  -> 返回当前分享次数 { count }
//   POST -> 分享次数 +1，返回新的 { count }
// 数据存于 Cloudflare D1。表结构自举创建，无需手动建表。
//
// 重要：D1 绑定名必须与你自己现有函数（如 functions/api/guests.js）里用的一致。
// 如果现有函数里是 env.DB 就保持 DB；若是 env.MYDB 之类，请把下面两处 env.DB 改掉。

export async function onRequest(context) {
  const { request, env } = context;
  const db = env.DB; // ← 若你的绑定名不是 DB，请改成实际名字

  if (!db) {
    return Response.json({ error: "D1 绑定 'DB' 未配置，请检查 wrangler.toml / Pages 设置里的 D1 绑定名" }, { status: 500 });
  }

  try {
    // 自举：建表 + 种子行
    await db.exec(
      "CREATE TABLE IF NOT EXISTS share_stats (id INTEGER PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0)"
    );
    await db.prepare("INSERT OR IGNORE INTO share_stats (id, count) VALUES (1, 0)").run();

    if (request.method === "POST") {
      await db.prepare("UPDATE share_stats SET count = count + 1 WHERE id = 1").run();
    }

    const row = await db.prepare("SELECT count FROM share_stats WHERE id = 1").first();
    return Response.json({ count: row ? row.count : 0 });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
