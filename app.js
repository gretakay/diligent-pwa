const FIREBASE_SERVER_KEY = "BNtFsLM3nWo29XIPahZnhsTbgHDUbCVZQZ0BYmUJNG5VoZMfwQoBO90zPasliyRt1DZ6M_R7uoqkQhx5ceKlF5Y";
const FIREBASE_SENDER_ID = "51223458709 ";

// **1️⃣ 儲存提醒時間**
function setReminder() {
    const time = document.getElementById("reminderTime").value;
    localStorage.setItem("reminderTime", time);
    alert(`提醒時間已設定為 ${time}`);
}

// **2️⃣ 訂閱 Web Push**
async function subscribeToPush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.log("不支援 Web Push");
        return;
    }

    const registration = await navigator.serviceWorker.register("service-worker.js");
    console.log("Service Worker 註冊成功", registration);

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
        subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(FIREBASE_SENDER_ID)
        });
    }

    console.log("已訂閱推播:", subscription);

    // **發送訂閱資訊到 Firebase**
    await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
            "Authorization": `key=${FIREBASE_SERVER_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            to: subscription.endpoint,
            notification: {
                title: "每日發四弘誓願",
                body: "眾生無邊誓願度 煩惱無盡誓願斷 法門無量誓願學 佛道無上誓願成",
                icon: "/icon.png"
            }
        })
    });
}

// **轉換 VAPID Key 格式**
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}
