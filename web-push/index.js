/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendPushNotification = functions.https.onRequest((req, res) => {
  const payload = {
    notification: {
      title: req.body.title,
      body: req.body.body,
      icon: req.body.icon || "/icon.png"
    }
  };

  const tokens = req.body.tokens; // 從請求中獲取訂閱令牌

  admin.messaging().sendToDevice(tokens, payload)
    .then(response => {
      console.log('推播通知發送成功:', response);
      res.status(200).send('推播通知發送成功');
    })
    .catch(error => {
      console.error('推播通知發送失敗:', error);
      res.status(500).send('推播通知發送失敗');
    });
});
