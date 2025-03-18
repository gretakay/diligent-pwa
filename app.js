import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyDFzFJ7yobQs_HUZKqLlPD7mAxYPCfptLw",
    authDomain: "dill-cc8be.firebaseapp.com",
    projectId: "dill-cc8be",
    storageBucket: "dill-cc8be.firebasestorage.app",
    messagingSenderId: "51223458709",
    appId: "1:51223458709:web:cd24df76a168e1384c3c9c",
    measurementId: "G-KQ91HMD2FX"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

if (window.navigator.standalone) {
    console.log("PWA 正在 Standalone 模式執行");
} else {
    console.log("PWA 在瀏覽器內執行");
}

document.addEventListener("DOMContentLoaded", async () => {
    // 註冊 Service Worker
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/firebase-messaging-sw.js")
            .then((registration) => {
                console.log("Service Worker 註冊成功:", registration);
            }).catch((error) => {
                console.log("Service Worker 註冊失敗:", error);
            });
    }

    // 取得提醒時間 (20250317 加入firebase以前的版本)
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

    const registration = await navigator.serviceWorker.register("./service-worker.js");
    console.log("Service Worker 註冊成功", registration);

    // 獲取 FCM 訂閱令牌
    getToken(messaging, { vapidKey: "BNtFsLM3nWo29XIPahZnhsTbgHDUbCVZQZ0BYmUJNG5VoZMfwQoBO90zPasliyRt1DZ6M_R7uoqkQhx5ceKlF5Y" }).then((currentToken) => {
        if (currentToken) {
            console.log("FCM 訂閱令牌:", currentToken);
            // 將訂閱令牌發送到 Firebase Cloud Functions
            fetch('https://dill-cc8be.cloudfunctions.net/sendPushNotification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tokens: [currentToken], payload: "這是一條測試推播通知" })
            });
        } else {
            console.log("無法獲取 FCM 訂閱令牌");
        }
    }).catch((err) => {
        console.log("獲取 FCM 訂閱令牌時發生錯誤:", err);
    });
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
