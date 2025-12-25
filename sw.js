self.addEventListener('push', event => {
    const data = event.data?.json() || {};

    self.registration.showNotification(data.title || 'new message yo', {
        body: data.body || 'someone messaged you',
        icon: '/favicon-16x16.png',
        badge: '/favicon-16x16.png',
        data: data.url || '/'
    });
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data)
    );
});
