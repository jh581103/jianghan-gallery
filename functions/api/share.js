// Cloudflare Pages Function: 分享计数
// 路由：/api/share
//   GET  -> 返回当前分享次数 { count }
//   POST -> 仅在用户今日未计过时分享次数 +1，返回新的 { count }

export async function onRequest(context) {
  const { request, env } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: "D1 绑定 'DB' 未配置" }, { status: 500 });
  }

  try {
    await db.exec(
      "CREATE TABLE IF NOT EXISTS share_stats (id INTEGER PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0)"
    );
    await db.prepare("INSERT OR IGNORE INTO share_stats (id, count) VALUES (1, 0)").run();

    await db.exec(
      "CREATE TABLE IF NOT EXISTS share_ips (ip TEXT PRIMARY KEY, day TEXT NOT NULL)"
    );

    const forwarded = request.headers.get('X-Forwarded-For');
    const clientIP = request.headers.get('CF-Connecting-IP')
                  || (forwarded ? forwarded.split(',')[0].trim() : null)
                  || 'unknown';
    const today = new Date().toISOString().slice(0, 10);

    if (request.method === "POST") {
      const existing = await db
        .prepare("SELECT 1 FROM share_ips WHERE ip = ? AND day = ?")
        .bind(clientIP, today)
        .first();

      if (!existing) {
        await db.prepare("UPDATE share_stats SET count = count + 1 WHERE id = 1").run();
        await db
          .prepare("INSERT OR REPLACE INTO share_ips (ip, day) VALUES (?, ?)")
          .bind(clientIP, today)
          .run();
      }
    }

    const row = await db.prepare("SELECT count FROM share_stats WHERE id = 1").first();
    return Response.json({ count: row ? row.count : 0 });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
