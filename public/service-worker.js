self.addEventListener("push", event => {
    const data = event.data ? event.data.json() : {};
    event.waitUntil(
        self.registration.showNotification(data.title || "提醒", {
            body: data.body || "這是一條推播通知",
            icon: data.icon || "/icon.png"
        })
    );
});
