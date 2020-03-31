const functions = require('firebase-functions');
const admin     = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://lynx-v2.firebaseio.com"
});

const firestore = admin.firestore();

exports.createUserData = functions.auth.user().onCreate((user) => {
  const uid = user.uid;
  const phone = user.phoneNumber;

  let userDoc = firestore.doc(`users/${uid}`);
  
  userDoc.set({
    phone  : phone,
    sendits: [],
    created: new Date()
  }).then(res => {
    console.log(`User document created for ${uid}`);
  }).catch(err => {
    console.error(err);
  });
});

exports.eraseUserData = functions.auth.user().onDelete((user) => {
  const uid = user.uid;

  let userDoc = firestore.doc(`users/${uid}`);
  
  userDoc.delete().then(() => {
    console.log(`User document deleted for ${uid}`);
  }).catch(err => {
    console.error(err);
  });
});
