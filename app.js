document.addEventListener("DOMContentLoaded", async () => {
    // 取得提醒時間
    loadReminderTime();

    // 訂閱推播
    await subscribeToPush();

    // 每分鐘檢查是否需要發送提醒
    setInterval(checkReminder, 60000);
});

// **1️⃣ 訂閱 Web Push**
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
            applicationServerKey: "你的_VAPID_PUBLIC_KEY"
        });
    }

    console.log("已訂閱推播:", subscription);
}

// **2️⃣ 設定提醒時間**
function setReminder() {
    const time = document.getElementById("reminderTime").value;
    if (!time) {
        alert("請選擇提醒時間！");
        return;
    }

    localStorage.setItem("reminderTime", time);
    alert(`提醒時間已設定為 ${time}`);
}

// **3️⃣ 載入已儲存的提醒時間**
function loadReminderTime() {
    const savedTime = localStorage.getItem("reminderTime");
    if (savedTime) {
        document.getElementById("reminderTime").value = savedTime;
    }
}

// **4️⃣ 每分鐘檢查是否應該發送提醒**
function checkReminder() {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
    const reminderTime = localStorage.getItem("reminderTime");

    if (reminderTime && currentTime === reminderTime) {
        sendPushNotification();
    }
}

// **5️⃣ 直接顯示通知（不透過伺服器）**
function sendPushNotification() {
    navigator.serviceWorker.ready.then(registration => {
        registration.showNotification("每日發四弘誓願", {
            body: "眾生無邊誓願度，煩惱無盡誓願斷，法門無量誓願學，佛道無上誓願成",
            icon: "/icon.png"
        });
    });
}
