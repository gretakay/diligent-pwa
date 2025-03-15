const publicVapidKey = "BDX28SBzyfKzjxbUJXoIOwtEwQjcYfiJ2XcDzYhMrF6BJUHWFIEKviZpLVKIquXgEy6gmxUbjqETyT3GLQQxpg8"; 

// 註冊 Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/diligent-pwa/service-worker.js')
        .then(registration => {
            console.log('Service Worker 註冊成功:', registration);
            subscribeToPush(registration);
        })
        .catch(error => console.log('Service Worker 註冊失敗:', error));
}

// 訂閱 Web Push
async function subscribeToPush(registration) {
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });

    console.log("訂閱成功:", JSON.stringify(subscription));

    // 傳送訂閱資訊到 Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbzGUdaRAC9POPKV8ACt-Mte3WftYABeLG2klQxOoUSqr9LAGcyfjD6SqHDnsNWY_vuK/exec', {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "Content-Type": "application/json"
        }
    });
}

// 轉換金鑰格式
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}
