import { Hono } from 'hono';
import { health } from '@/routes/health';
import { video } from '@/routes/video';

export const restHandler = new Hono()
	.route('/health', health)
	.route('/video', video)
	.onError((err, c) => {
		console.log(err);
		return c.json({ error: err.message }, 500);
	});

export type RestRouter = typeof restHandler;
