export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const body = await request.json();
    const name = String(body && body.name || '').trim();
    let avatar = String(body && body.avatar || '').trim();
    if (!name) {
      return jsonResponse({ error: 'name required' }, 400);
    }
    if (name.length > 20) {
      return jsonResponse({ error: 'name too long' }, 400);
    }
    if (avatar && !avatar.startsWith('data:image/')) {
      avatar = '';
    }
    if (avatar.length > 100000) {
      avatar = avatar.slice(0, 100000);
    }
    await env.DB.prepare('INSERT INTO guests (name, avatar, ts) VALUES (?, ?, ?)')
      .bind(name, avatar, Date.now())
      .run();
    return jsonResponse({ success: true, name });
  } catch (e) {
    return jsonResponse({ error: e.message }, 500);
  }
}

export async function onRequestGet(context) {
  const { env } = context;
  try {
    const result = await env.DB.prepare(
      'SELECT name, avatar, ts FROM guests ORDER BY ts DESC LIMIT 50'
    ).all();
    return jsonResponse(result.results || []);
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
