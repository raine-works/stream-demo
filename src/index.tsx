import { createRoot } from 'react-dom/client';
import { restClient } from '@/lib/client';
import App from '@/app';

const root = document.getElementById('root');

if (!root) {
	throw new Error();
}

createRoot(root).render(<App />);

function urlBase64ToUint8Array(base64String: string) {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

const registerPush = async () => {
	try {
		const keyResponse = await restClient.notification['public-key'].$get();
		const keyData = await keyResponse.json();
		// Register the Service Worker
		await navigator.serviceWorker.register('/sw.js');

		// Wait until the Service Worker is active
		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(keyData.key)
		});

		const rawKey = subscription.getKey('p256dh');
		const rawAuth = subscription.getKey('auth');

		await restClient.notification.subscribe.$post({
			json: {
				endpoint: subscription.endpoint,
				keys: {
					p256dh: rawKey ? btoa(String.fromCharCode(...new Uint8Array(rawKey))) : '',
					auth: rawAuth ? btoa(String.fromCharCode(...new Uint8Array(rawAuth))) : ''
				}
			}
		});
	} catch (err) {
		console.error(err);
	}
};

registerPush();
