importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js');

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
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
