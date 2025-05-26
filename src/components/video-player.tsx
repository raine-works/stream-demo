import { useRef, useState, useEffect } from 'react';
import { testNetworkSpeed, getQuality } from '@/lib/utils';

export default function VideoPlayer() {
	const videoRef = useRef<HTMLVideoElement>(null);
	const inProgressRef = useRef(false);
	const [downloadSpeed, setDownloadSpeed] = useState<number>(0);
	const [quality, setQuality] = useState<string>('1920p');

	// Utility function to race a promise with a timeout
	const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
		return Promise.race([
			promise,
			new Promise<T>((_, reject) =>
				setTimeout(() => reject(new Error('Network test timed out')), timeoutMs)
			)
		]);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const runSpeedTest = async () => {
			if (inProgressRef.current) return;

			inProgressRef.current = true;
			try {
				const { downloadSpeedMbps } = await withTimeout(testNetworkSpeed(), 5000);
				setDownloadSpeed(downloadSpeedMbps);
			} catch (err) {
				console.error(err);
				setDownloadSpeed(0);
			} finally {
				inProgressRef.current = false;
			}
		};

		runSpeedTest();
		const intervalId = setInterval(runSpeedTest, 10000);

		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		setQuality(getQuality(downloadSpeed));
	}, [downloadSpeed]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: quality is sufficient here
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const currentTime = video.currentTime;
		const wasPlaying = !video.paused;

		const handleLoaded = () => {
			video.currentTime = currentTime;
			if (wasPlaying) {
				video.play().catch(console.error);
			}
			video.removeEventListener('loadedmetadata', handleLoaded);
		};

		video.addEventListener('loadedmetadata', handleLoaded);
		video.load();
	}, [quality]);

	return (
		<div>
			<p>Estimated Network Speed: {downloadSpeed} Mbps</p>
			{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
			<video ref={videoRef} width="640" height="360" controls>
				<source src={`http://localhost:8000/video/${quality}/test.mp4`} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>
	);
}
