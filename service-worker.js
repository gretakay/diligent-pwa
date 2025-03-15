self.addEventListener('push', function(event) {
    const options = {
        body: event.data.text(),
        icon: '/icon.png',
        badge: '/badge.png'
    };
    event.waitUntil(
        self.registration.showNotification('每日發四弘誓願', options)
    );
});
