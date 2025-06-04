import { z } from 'zod';

export const env = z
	.object({
		NODE_ENV: z.enum(['test', 'development', 'production']),
		TZ: z.string(),
		VAPID_PRIVATE_KEY: z.string(),
		VAPID_PUBLIC_KEY: z.string()
	})
	.parse(Bun.env);
