import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { hc } from 'hono/client';
import type { RouterClient } from '@orpc/server';
import type { RPCRouter } from '@/rpc';
import type { RestRouter } from '@/routes';

const link = new RPCLink({
	url: 'http://localhost:8000/rpc'
});

export const rpcClient: RouterClient<RPCRouter> = createORPCClient(link);

export const restClient = hc<RestRouter>('http://localhost:8000');
