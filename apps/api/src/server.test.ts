import { createServer } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from './app.js';

describe('API Server', () => {
  let server: ReturnType<typeof createServer>;

  beforeAll(() => {
    const app = createApp();
    server = createServer(app);
    server.listen(3000);
  });

  afterAll(() => {
    server.close();
  });

  it('should return 200 OK for the root endpoint', async () => {
    const response = await fetch('http://localhost:3000');
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({
      message: 'Welcome to the TDD workshop!',
    });
  });

  it('should return 404 for non-existent endpoints', async () => {
    const response = await fetch('http://localhost:3000/non-existent');
    expect(response.status).toBe(404);
  });
});
