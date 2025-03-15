if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/diligent-pwa/service-worker.js')
        .then(registration => {
            console.log('Service Worker 註冊成功:', registration);
        })
        .catch(error => {
            console.log('Service Worker 註冊失敗:', error);
        });
}

// 允許推播通知
document.getElementById('enableNotifications').addEventListener('click', () => {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            showNotification("請記得發四弘誓願！");
        } else {
            console.log('使用者拒絕推播');
        }
    });
});

function showNotification(message) {
    navigator.serviceWorker.ready.then(registration => {
        registration.showNotification("每日發四弘誓願", {
            body: message,
            icon: "/icon.png",
            badge: "/badge.png",
        });
    });
}
