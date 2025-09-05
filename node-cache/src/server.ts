import 'dotenv/config';
import express from 'express';
import { redis } from './redis';
import { pool, PostRow } from './db';

export const app = express();
app.use(express.json());

const TTL = Number(process.env.CACHE_TTL || 120);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/cache/posts', async (_req, res) => {
  const key = 'posts:all';
  try {
    const cached = await redis.get(key);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(JSON.parse(cached));
    }

    const [rows] = await pool.query<PostRow[]>(
      'SELECT id, title, content, user_id, created_at, updated_at FROM posts ORDER BY id DESC'
    );

    await redis.setEx(key, TTL, JSON.stringify(rows));
    res.setHeader('X-Cache', 'MISS');
    return res.json(rows);
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ message: 'cache list error', error: e?.message });
  }
});

app.get('/cache/posts/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ message: 'invalid id' });

  const key = `posts:${id}`;
  try {
    const cached = await redis.get(key);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(JSON.parse(cached));
    }

    const [rows] = await pool.query<PostRow[]>(
      'SELECT id, title, content, user_id, created_at, updated_at FROM posts WHERE id = ? LIMIT 1',
      [id]
    );
    const post = rows[0];
    if (!post) return res.status(404).json({ message: 'not found' });

    await redis.setEx(key, TTL, JSON.stringify(post));
    res.setHeader('X-Cache', 'MISS');
    return res.json(post);
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ message: 'cache item error', error: e?.message });
  }
});

const port = Number(process.env.PORT || 4000);

async function start() {
  await redis.connect();
  app.listen(port, () => {
    console.log(`Node cache API listening on http://localhost:${port}`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  start().catch((e) => {
    console.error('Failed to start:', e);
    process.exit(1);
  });
}

process.on('SIGINT', async () => {
  await redis.quit();
  process.exit(0);
});

export default app;


