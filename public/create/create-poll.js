function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

document.querySelector('#createTrigger').addEventListener('click', function() {
	let firestore = firebase.firestore();

	let questionInput = document.querySelector('#questionInput');
	let questionText  = questionInput.value;
	
	let usernameInput = document.querySelector('#usernameInput');
	let usernameText  = usernameInput.value;

	let documentName = uuidv4();

	firestore.collection('sendits').doc(documentName).set({
		created : new Date(),
		creator : usernameText,
		question: questionText 
	}).then(() => {
		console.log('Sendit created successfully!');
		// Update user document
		let currentUser = firebase.auth().currentUser;
		firestore.collection('users').doc(currentUser.uid).update({
			sendits: firebase.firestore.FieldValue.arrayUnion(documentName)
		}).then(() => {
			//location.replace('/sendits/');
			console.log(`added ${documentName} to users/${currentUser}`);
		}).catch(err => {
			console.error(err);
			console.error('Failed to update user document');
		});
	}).catch(err => {
		console.error(err);
	});
});

firebase.auth().onAuthStateChanged(function(u) {
	if (u) {
		//console.log('Calling init function');
		//init();
	} else {
		console.error('No current user found');
		location.replace('/');
	}
});
