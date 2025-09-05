jest.mock('../src/redis', () => {
  const m = {
    connect: jest.fn().mockResolvedValue(undefined),
    quit: jest.fn().mockResolvedValue(undefined),
    get: jest.fn().mockResolvedValue(null),
    setEx: jest.fn().mockResolvedValue('OK'),
    isOpen: true
  };
  return { redis: m };
});

jest.mock('../src/db', () => {
  const rows = [
    { id: 1, title: 'T1', content: 'C1', user_id: 1, created_at: '2025-09-04T01:00:00.000Z', updated_at: '2025-09-04T01:00:00.000Z' }
  ];
  return {
    pool: { query: jest.fn().mockResolvedValue([rows]) }
  };
});

import request from 'supertest';
import app from '../src/server';
import { redis } from '../src/redis';
import { pool } from '../src/db';

describe('cache api', () => {
  afterAll(async () => {
    await redis.quit();
  });

  it('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('GET /cache/posts MISS then cache', async () => {
    (redis.get as jest.Mock).mockResolvedValueOnce(null);
    const res = await request(app).get('/cache/posts');
    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('MISS');
    expect(res.body).toHaveLength(1);
    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(redis.setEx).toHaveBeenCalledTimes(1);
  });

  it('GET /cache/posts HIT', async () => {
    const rows = [
      { id: 2, title: 'T2', content: 'C2', user_id: 1, created_at: '2025-09-04T01:00:00.000Z', updated_at: '2025-09-04T01:00:00.000Z' }
    ];
    (redis.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(rows));
    const res = await request(app).get('/cache/posts');
    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('HIT');
    expect(res.body).toHaveLength(1);
  });

  it('GET /cache/posts/:id invalid', async () => {
    const res = await request(app).get('/cache/posts/abc');
    expect(res.status).toBe(400);
  });

  it('GET /cache/posts/:id MISS then cache', async () => {
    (redis.get as jest.Mock).mockResolvedValueOnce(null);
    (pool.query as jest.Mock).mockResolvedValueOnce([
      [{ id: 3, title: 'T3', content: 'C3', user_id: 1, created_at: '2025-09-04T01:00:00.000Z', updated_at: '2025-09-04T01:00:00.000Z' }]
    ]);
    const res = await request(app).get('/cache/posts/3');
    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('MISS');
    expect(res.body.id).toBe(3);
  });

  it('GET /cache/posts/:id HIT', async () => {
    const row = { id: 4, title: 'T4', content: 'C4', user_id: 1, created_at: '2025-09-04T01:00:00.000Z', updated_at: '2025-09-04T01:00:00.000Z' };
    (redis.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(row));
    const res = await request(app).get('/cache/posts/4');
    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('HIT');
    expect(res.body.id).toBe(4);
  });
});

