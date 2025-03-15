import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js";

// ✅ 你的 Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyDFzFJ7yobQs_HUZKqLlPD7mAxYPCfptLw",
  authDomain: "dill-cc8be.firebaseapp.com",
  projectId: "dill-cc8be",
  storageBucket: "dill-cc8be.firebasestorage.app",
  messagingSenderId: "51223458709",
  appId: "1:51223458709:web:cd24df76a168e1384c3c9c"
};

// ✅ 初始化 Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 🔔 **請求推播權限**
async function requestPermission() {
    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("🔔 推播權限已允許");
            getPushToken(); // 取得 Token
        } else {
            console.warn("⛔ 推播權限被拒絕");
        }
    } catch (err) {
        console.error("⚠️ 請求推播權限失敗:", err);
    }
}

// 🎫 **取得推播 Token**
async function getPushToken() {
    try {
        const token = await getToken(messaging, { vapidKey: "BNtFsLM3nWo29XIPahZnhsTbgHDUbCVZQZ0BYmUJNG5VoZMfwQoBO90zPasliyRt1DZ6M_R7uoqkQhx5ceKlF5Y" });
        if (token) {
            console.log("✅ 推播 Token:", token);
            sendTokenToServer(token); // 儲存 Token
        } else {
            console.warn("⚠️ 無法取得推播 Token");
        }
    } catch (err) {
        console.error("⚠️ 取得推播 Token 失敗:", err);
    }
}

// 📤 **將 Token 傳送到伺服器**
function sendTokenToServer(token) {
    fetch("https://us-central1-dill-cc8be.cloudfunctions.net/sendPushNotification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token })
    })
    .then(response => response.json())
    .then(data => console.log("✅ Token 上傳成功:", data))
    .catch(err => console.error("⚠️ Token 上傳失敗:", err));
}

// 📬 **接收推播通知**
onMessage(messaging, (payload) => {
    console.log("📩 收到推播:", payload);
    new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/icon.png"
    });
});

// ✅ **設置提醒時間**
function setReminder() {
    const time = document.getElementById("reminderTime").value;
    localStorage.setItem("reminderTime", time);
    alert("📅 已儲存提醒時間：" + time);
}

// ✅ **訂閱推播**
function subscribeToPush() {
    requestPermission();
}

// 🟢 **確保這些函式可供 HTML 使用**
window.setReminder = setReminder;
window.subscribeToPush = subscribeToPush;

// 🚀 **載入時自動請求推播權限**
document.addEventListener("DOMContentLoaded", () => {
    if (Notification.permission === "granted") {
        getPushToken();
    }
});
