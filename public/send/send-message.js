function getParameters(){var t=window.location.href.split("?");if(1===t.length)return null;var r,e=t[1].split("&"),l="{",n="";for(r=0;r<e.length;r++)n=e[r].split("="),0<r&&(l+=","),isNaN(n[1])?"true"===n[1]||"false"===n[1]?l+='"'+n[0]+'":'+n[1]:l+='"'+n[0]+'":"'+n[1]+'"':l+='"'+n[0]+'":'+n[1];return l+="}"}

// should have 1 parameter: id, which is the 16 hexadecimal
// string representing the responses document reference
const parameters = JSON.parse(getParameters());
const responseDoc = parameters.id;

const firestore = firebase.firestore();

// Need to: get creator's username from database

const inputBox = document.getElementById("typebox");

inputBox.addEventListener("focus", function () {
  // Fires constantly when the box is in focus
  inputBox.style.textAlign = "left";
  inputBox.placeholder = "";
});

inputBox.addEventListener("blur", function () {
  let value = inputBox.value;
  if (value.replace(/\s/g, "") == "") {
    inputBox.style.textAlign = "center";
    inputBox.placeholder = "Send it!";
    inputBox.value = "";
  }
});

document.getElementById("sendTrigger").addEventListener("click", function () {
  if (inputBox.value.replace(/\s/g, "") !== "") {
    // Send message to firebase
	let message = inputBox.value;

	// Get current responses and add to them
	firestore.collection('responses').doc(responseDoc).get().then(doc => {
		let data = doc.data();
		console.log(data);
	}).catch(err => {
		console.error(err);
		alert('Uh oh, looks like something went wrong in the code! Sorry about that! With any questions, contact the developer at https://github.com/joshuasmith2021/fullsend');
	});
  }
});
