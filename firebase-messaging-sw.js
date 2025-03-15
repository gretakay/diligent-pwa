importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDFzFJ7yobQs_HUZKqLlPD7mAxYPCfptLw",
  authDomain: "dill-cc8be.firebaseapp.com",
  projectId: "dill-cc8be",
  storageBucket: "dill-cc8be.firebasestorage.app",
  messagingSenderId: "51223458709",
  appId: "1:51223458709:web:cd24df76a168e1384c3c9c"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 監聽背景推播通知
messaging.onBackgroundMessage((payload) => {
    console.log("收到背景推播通知：", payload);

    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/icon.png",
        data: payload.notification.click_action // 可點擊跳轉
    });
});

// 點擊通知後的動作
self.addEventListener("notificationclick", function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data || "/")
    );
});
