self.addEventListener('push', event => {
    const data = event.data?.json() || {};

    self.registration.showNotification(data.title || 'new message yo', {
        body: data.body || 'get here bro',
        icon: '/android-chrome-192x192.png',
        badge: '/android-chrome-192x192.png',
        data: data.url || '/'
    });
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data)
    );
});

