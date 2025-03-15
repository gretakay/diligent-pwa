import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js";

// ✅ Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyDFzFJ7yobQs_HUZKqLlPD7mAxYPCfptLw",
  authDomain: "dill-cc8be.firebaseapp.com",
  projectId: "dill-cc8be",
  storageBucket: "dill-cc8be.firebasestorage.app", // 修正錯誤的 storageBucket
  messagingSenderId: "51223458709",
  appId: "1:51223458709:web:cd24df76a168e1384c3c9c"
};

// ✅ 初始化 Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// ✅ 註冊 Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/firebase-messaging-sw.js")
        .then((registration) => {
            console.log("✅ Service Worker 註冊成功！", registration);
        })
        .catch((error) => {
            console.error("⚠️ Service Worker 註冊失敗", error);
        });
}

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
    const hour = document.getElementById("reminderHour").value;
    const minute = document.getElementById("reminderMinute").value;
    const time = `${hour}:${minute}`;
    
    localStorage.setItem("reminderTime", time);
    document.getElementById("statusMessage").innerText = `📅 已儲存提醒時間：${time}`;
}

// ✅ **訂閱推播**
function subscribeToPush() {
    requestPermission();
}

// 🟢 **確保函式可被 index.html 匯入**
export { setReminder, subscribeToPush };

// 🚀 **載入時自動請求推播權限**
document.addEventListener("DOMContentLoaded", () => {
    if (Notification.permission === "granted") {
        getPushToken();
    }
});
