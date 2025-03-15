// 引入 Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js";

// 🔹 **請更新這裡的 Firebase 設定**
const firebaseConfig = {
  authDomain: "dill-cc8be.firebaseapp.com",
  projectId: "dill-cc8be",
  storageBucket: "dill-cc8be.firebasestorage.app",
  messagingSenderId: "51223458709",
  appId: "1:51223458709:web:cd24df76a168e1384c3c9c"
};

// 🔹 **初始化 Firebase**
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 🔹 **請求推播權限 & 取得 Token**
async function requestNotificationPermission() {
    try {
        // 1️⃣ 請求瀏覽器的通知權限
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            throw new Error("通知權限未授予");
        }

        // 2️⃣ 取得 FCM 推播 Token (請確保 VAPID 公鑰正確)
        const token = await getToken(messaging, { vapidKey: "
BNtFsLM3nWo29XIPahZnhsTbgHDUbCVZQZ0BYmUJNG5VoZMfwQoBO90zPasliyRt1DZ6M_R7uoqkQhx5ceKlF5Y" });
        console.log("📌 獲得推播 Token:", token);

        // 3️⃣ 這裡可以將 Token 上傳到 Firebase Database 或 Cloud Functions
        saveTokenToServer(token);

    } catch (error) {
        console.error("❌ 無法取得推播 Token:", error);
    }
}

// 🔹 **上傳推播 Token 到 Firebase**
function saveTokenToServer(token) {
    fetch("你的 Firebase Cloud Function API", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token })
    })
    .then(response => response.json())
    .then(data => console.log("✅ Token 已儲存:", data))
    .catch(error => console.error("❌ 無法儲存 Token:", error));
}

// 🔹 **監聽推播通知**
onMessage(messaging, (payload) => {
    console.log("📩 收到推播:", payload);
    new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/icon.png"
    });
});

// 🔹 **啟動推播權限請求**
document.getElementById("enableNotifications").addEventListener("click", () => {
    requestNotificationPermission();
});
