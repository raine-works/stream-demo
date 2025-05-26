import { Hono } from 'hono';

export const video = new Hono().get('/:quality/:name', async (c) => {
	const quality = c.req.param('quality');
	const name = c.req.param('name');
	const filename = `../videos/${name.replace('.mp4', `_${quality}.mp4`)}`;
	const resolvedPath = Bun.resolveSync(filename, import.meta.dir);
	const file = Bun.file(resolvedPath);
	const fileSize = file.size;
	const rangeHeader = c.req.header('range');

	if (!rangeHeader) {
		const fileArrayBuffer = await file.arrayBuffer();
		return c.newResponse(fileArrayBuffer, 200, {
			'Content-Length': String(fileSize),
			'Content-Type': 'video/mp4'
		});
	}

	const parts = rangeHeader.replace(/bytes=/, '').split('-');
	const start = Number.parseInt(parts[0], 10);
	const end = parts[1] ? Number.parseInt(parts[1], 10) : fileSize - 1;
	const chunkSize = end - start + 1;
	const slice = file.slice(start, end + 1);
	const sliceArrayBuffer = await slice.arrayBuffer();
	return c.newResponse(sliceArrayBuffer, 206, {
		'Content-Range': `bytes ${start}-${end}/${fileSize}`,
		'Accept-Ranges': 'bytes',
		'Content-Length': String(chunkSize),
		'Content-Type': 'video/mp4'
	});
});
