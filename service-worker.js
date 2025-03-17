self.addEventListener("push", event => {
    const data = event.data ? event.data.text() : "每日發四弘誓願";
    event.waitUntil(
        self.registration.showNotification("提醒", {
            body: data,
            icon: "/icon.png"
        })
    );
});
