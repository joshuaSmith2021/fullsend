const functions = require('firebase-functions');
const admin     = require('firebase-admin');

const firestore = admin.firestore();

const serviceAccount = require("serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lynx-v2.firebaseio.com"
});


exports.createUserData = functions.auth.user().onCreate((user) => {
// [END onCreateTrigger]
  // [START eventAttributes]
  //const email = user.email; // The email of the user.
  //const displayName = user.displayName; // The display name of the user.
  const uid = user.uid;
  const phone = user.phoneNumber;
  // [END eventAttributes]
  let userDoc = firestore.doc(`users/${uid}`);
  let sendDoc = firestore.doc(`sendits/${uid}`)
  
  userDoc.set({
    phone  : phone,
    sendits: sendDoc.path,
    created: new Date()
  }).then(res => {
    console.log(`Document written at ${res.updateTime}`);
  }).catch(err => {
    console.error(err);
  });
});


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
