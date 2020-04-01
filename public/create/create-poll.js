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
