import { rpcHandler } from '@/rpc';
import { restHandler } from '@/routes';
import index from './index.html';

const startServer = async (port: number) => {
	console.log('Starting server...');
	return Bun.serve({
		port,
		development: {
			hmr: true,
			console: true
		},
		routes: {
			'/': index,
			'/sw.js': () =>
				new Response(Bun.file(Bun.resolveSync('./sw.js', import.meta.dir)), {
					status: 200,
					headers: { 'Content-Type': 'text/javascript' }
				})
		},
		async fetch(request: Request) {
			const { matched, response } = await rpcHandler.handle(request, {
				prefix: '/rpc',
				context: { headers: request.headers }
			});

			if (matched) {
				return response;
			}

			return restHandler.fetch(request);
		}
	});
};

const server = await startServer(8000);

process.on('SIGINT', async () => {
	console.log('Stopping server...');
	await server.stop();
	process.exit(0);
});
