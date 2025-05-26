import { restClient } from '@/lib/client';

export const testNetworkSpeed = async () => {
	// Test latency
	const latencyStart = performance.now();
	await restClient.health.ping.$get();
	const latencyEnd = performance.now();
	const latency = latencyEnd - latencyStart;

	// Test download speed
	const downloadStart = performance.now();
	const res = await restClient.health.speed.$get();
	const blob = await res.blob();
	const downloadEnd = performance.now();
	const durationSeconds = (downloadEnd - downloadStart) / 1000;

	const bitsLoaded = blob.size * 8;
	const speedMbps = bitsLoaded / durationSeconds / 1024 / 1024;

	return {
		latencyMs: latency,
		downloadSpeedMbps: speedMbps
	};
};

export const getQuality = (bitrate: number) => {
	if (bitrate > 20) {
		return '1920p';
	}
	if (bitrate > 10) {
		return '1280p';
	}
	if (bitrate > 5) {
		return '640p';
	}
	return '480p';
};
