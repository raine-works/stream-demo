import { Hono } from 'hono';
import crypto from 'node:crypto';

export const health = new Hono()
	.get('/ping', (c) => {
		return c.json({ message: 'pong' });
	})
	.get('/speed', (c) => {
		const sizeInMB = Number(c.req.query('size')) || 1;
		const buffer = crypto.randomBytes(sizeInMB * 1024 * 1024);
		return c.newResponse(buffer, 200, { 'Content-Type': 'application/octet-stream' });
	});
