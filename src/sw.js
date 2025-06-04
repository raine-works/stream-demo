self.addEventListener('push', (event) => {
	const data = event.data?.json() || { title: 'No title', body: 'No body' };

	event.waitUntil(
		self.registration.showNotification(data.title, {
			body: data.body
		})
	);
});
