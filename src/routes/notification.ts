import webPush, { type PushSubscription } from 'web-push';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { env } from '@/lib/env';
import { z } from 'zod';

const subscriptions: PushSubscription[] = [];

webPush.setVapidDetails('mailto:your@email.com', env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY);

export const notification = new Hono()
	.get('/public-key', (c) => c.json({ key: env.VAPID_PUBLIC_KEY }))
	.post(
		'/subscribe',
		zValidator(
			'json',
			z.object({
				endpoint: z.string(),
				expirationTime: z.number().optional(),
				keys: z.object({
					p256dh: z.string(),
					auth: z.string()
				})
			})
		),
		async (c) => {
			const subscription = c.req.valid('json');
			subscriptions.push(subscription);
			return c.json({ msg: 'subscribed' });
		}
	)
	.post('/send', zValidator('json', z.object({ message: z.string() })), async (c) => {
		const message = c.req.valid('json').message;

		for (const sub of subscriptions) {
			await webPush
				.sendNotification(sub, JSON.stringify({ title: 'LETS GO!', body: message }))
				.catch(console.error);
		}

		return c.json({ message: 'sent' });
	});
