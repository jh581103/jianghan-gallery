export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const body = await request.json();
    const work_id = parseInt(body && body.work_id, 10);
    if (!work_id || work_id <= 0) {
      return jsonResponse({ error: 'invalid work_id' }, 400);
    }
    await env.DB.prepare('INSERT INTO plays (work_id, ts) VALUES (?, ?)')
      .bind(work_id, Date.now())
      .run();
    const row = await env.DB.prepare('SELECT COUNT(*) as count FROM plays WHERE work_id = ?')
      .bind(work_id)
      .first();
    return jsonResponse({ work_id, count: row ? row.count : 0 });
  } catch (e) {
    return jsonResponse({ error: e.message }, 500);
  }
}

export async function onRequestGet(context) {
  const { env, request } = context;
  try {
    const url = new URL(request.url);
    const single = url.searchParams.get('work_id');
    const multiple = url.searchParams.get('work_ids');
    if (!single && !multiple) {
      return jsonResponse({ error: 'missing work_id or work_ids' }, 400);
    }
    const ids = (multiple || single).split(',').map(s => parseInt(s.trim(), 10)).filter(n => n > 0);
    if (ids.length === 0) {
      return jsonResponse({ error: 'invalid work_id' }, 400);
    }
    if (ids.length === 1) {
      const row = await env.DB.prepare('SELECT COUNT(*) as count FROM plays WHERE work_id = ?')
        .bind(ids[0])
        .first();
      return jsonResponse({ [ids[0]]: row ? row.count : 0 });
    }
    const placeholders = ids.map(() => '?').join(',');
    const result = await env.DB.prepare(
      `SELECT work_id, COUNT(*) as count FROM plays WHERE work_id IN (${placeholders}) GROUP BY work_id`
    ).bind(...ids).all();
    const counts = {};
    ids.forEach(id => counts[id] = 0);
    (result.results || []).forEach(r => {
      counts[r.work_id] = r.count || 0;
    });
    return jsonResponse(counts);
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
