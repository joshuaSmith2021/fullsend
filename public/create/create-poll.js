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
