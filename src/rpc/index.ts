import { RPCHandler } from '@orpc/server/fetch';
import { CORSPlugin } from '@orpc/server/plugins';
import { os } from '@orpc/server';

export const base = os.$context<{ headers: Headers }>();

const router = {};

export const rpcHandler = new RPCHandler(router, {
	plugins: [new CORSPlugin()]
});

export type RPCRouter = typeof router;
