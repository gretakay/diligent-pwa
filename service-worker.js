self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : {};
    self.registration.showNotification(data.title || "每日發四弘誓願", {
        body: data.body || "眾生無邊誓願度，煩惱無盡誓願斷，法門無量誓願學，佛道無上誓願成",
        icon: '/diligent-pwa/icon.png',
    });
});
