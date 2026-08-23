export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const body = await request.json();
    let name = String(body && body.name || '').trim();
    // 强制昵称最多 2 字（站长要求所有访客昵称统一为两字）
    if (name.length > 2) name = name.slice(0, 2);
    let avatar = String(body && body.avatar || '').trim();
    const visitor_id = String(body && body.visitor_id || '').trim();
    if (!name) {
      return jsonResponse({ error: 'name required' }, 400);
    }
    if (name.length > 20) {
      return jsonResponse({ error: 'name too long' }, 400);
    }
    // 头像允许 data:image/ 或 http(s):// （微信头像为外链）
    if (avatar && !/^data:image\//.test(avatar) && !/^https?:\/\//.test(avatar)) {
      avatar = '';
    }
    if (avatar.length > 200000) {
      avatar = avatar.slice(0, 200000);
    }
    // 按 visitor_id 去重并累加访问次数：存在则 +1 并更新时间，不存在则插入（首次=1）
    if (visitor_id) {
      await env.DB.prepare('UPDATE guests SET ts = ?, name = ?, avatar = ?, visit_count = visit_count + 1 WHERE visitor_id = ?')
        .bind(Date.now(), name, avatar, visitor_id).run();
      await env.DB.prepare('INSERT INTO guests (name, avatar, ts, visitor_id, visit_count) SELECT ?, ?, ?, ?, 1 WHERE NOT EXISTS (SELECT 1 FROM guests WHERE visitor_id = ?)')
        .bind(name, avatar, Date.now(), visitor_id, visitor_id).run();
    } else {
      await env.DB.prepare('INSERT INTO guests (name, avatar, ts, visitor_id, visit_count) VALUES (?, ?, ?, ?, 1)')
        .bind(name, avatar, Date.now(), visitor_id || null, 1).run();
    }
    const cnt = await env.DB.prepare('SELECT COUNT(*) as total FROM guests').first();
    const vc = visitor_id ? (await env.DB.prepare('SELECT visit_count FROM guests WHERE visitor_id = ?').bind(visitor_id).first()) : null;
    return jsonResponse({ success: true, name, total: cnt ? cnt.total : 0, visit_count: vc ? vc.visit_count : 1 });
  } catch (e) {
    return jsonResponse({ error: e.message }, 500);
  }
}

export async function onRequestGet(context) {
  const { env } = context;
  try {
    const cnt = await env.DB.prepare('SELECT COUNT(*) as total FROM guests').first();
    const result = await env.DB.prepare(
      'SELECT name, avatar, ts, visit_count FROM guests ORDER BY ts DESC LIMIT 50'
    ).all();
    return jsonResponse({ total: cnt ? cnt.total : 0, guests: result.results || [] });
  } catch (e) {
    return jsonResponse({ error: e.message }, 500);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
