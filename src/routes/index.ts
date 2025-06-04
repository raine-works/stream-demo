import { Hono } from 'hono';
import { health } from '@/routes/health';
import { notification } from '@/routes/notification';
import { video } from '@/routes/video';

export const restHandler = new Hono()
	.route('/health', health)
	.route('/notification', notification)
	.route('/video', video)
	.onError((err, c) => {
		console.log(err);
		return c.json({ error: err.message }, 500);
	});

export type RestRouter = typeof restHandler;
