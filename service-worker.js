self.addEventListener("push", event => {
    const data = event.data ? event.data.json() : { title: "提醒", body: "每日發四弘誓願" };

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: "/icon.png",
            badge: "/badge.png"
        })
    );
});
