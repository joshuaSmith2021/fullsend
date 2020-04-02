const pollList = document.getElementById('displayPolls');

let userPolls = [];
let desiredLength = null;

function copyToClipboard (str) {
	const el = document.createElement('textarea');
	el.value = str;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}

function buildListItem(question, creation, docId, i) {
	const months = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'October', 'November', 'December'
	];
	
	function buildDate(date) {
		// Make time string
		let hour = date.getHours();
		let timeString = String([12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
						  12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11][hour]);

		timeString += ':';

		let minute = date.getMinutes();
		timeString += (minute > 9) ? String(minute) : `0${minute}`;

		timeString += (hour > 11) ? 'pm' : 'am';
		
		let calendar = `${months[date.getMonth()]} ${date.getDate()}`;
		
		return {
			timeString : timeString,
			calendarDay: calendar
		}
	}
	
	let fancyDate = buildDate(creation);

	return `<li class="mdl-list__item mdl-list__item--three-line"><span class="mdl-list__item-primary-content"><i class="material-icons mdl-list__item-avatar" style="background:none;color:#757575;">poll</i><span><a href="/responses/?id=${docId}">${question}</a></span><span class="mdl-list__item-text-body">Created on ${fancyDate.calendarDay} at ${fancyDate.timeString}</span></span><span class="mdl-list__item-secondary-content"><a class="mdl-list__item-secondary-action" id="tt${i}"><i class="material-icons copyLinkButton" data-docId="${docId}">link</i></a><div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="tt${i}">Copy Share Link</div></span></li>`;
}

function init() {
	console.log('Init function called');
	// Get data from firestore
	const user = firebase.auth().currentUser;
	const uid  = user.uid;
	const firestore = firebase.firestore();

	// Clear cache to get most up-to-date data
	//firestore.clearPersistence().then(() => {
	//	console.log('Successfully cleared firestore cache');
	//}).catch(err => {
	//	console.log('Unable to clear firestore cache');
	//});

	firestore.collection('users').doc(uid).get().then(doc => {
		console.log('User doc received');
		let data = doc.data();
		let pollIds = data.sendits;
		console.log('Response doc from users collection:');
		console.log(data);

		if (typeof pollIds !== "object") {
			pollIds = null;
		} else if (pollIds.length === 0) {
			pollIds = null;
		}

		if (pollIds === null) {
			// Create a no polls message or something, idk
			console.log('pollIds found to be null');
		} else {
			console.log('pollIds valid');
			desiredLength = pollIds.length;
			for (let i = 0; i < pollIds.length; i++) {
				let currentId = pollIds[i];
				console.log(`Sending request for sendit with id ${currentId}`);
				firestore.collection('sendits').doc(currentId).get().then(document => {
					let pollData = document.data();

					userPolls.push({
						question : pollData.question,
						timestamp: pollData.created,
						username : pollData.creator,
						id       : currentId
					});
				}).catch(err => {
					console.error(err);
				});
			}

			const checkForCompletion = setInterval(function() {
				if (userPolls.length === desiredLength) {
					clearInterval(checkForCompletion);
					console.log(userPolls);
					for (let j = 0; j < userPolls.length; j++) {
						let currentPoll = userPolls.sort(function(a, b) {
							return a.timestamp.seconds < b.timestamp.seconds;
						})[j];

						let d = new Date(0);
						d.setUTCSeconds(currentPoll.timestamp.seconds);
						console.log(d);
						console.log(currentPoll.timestamp.seconds);
						pollList.innerHTML += buildListItem(currentPoll.question, d, currentPoll.id, j);
					}

					const copyButtons = document.getElementsByClassName('copyLinkButton');

					for (let i = 0; i < copyButtons.length; i++) {
						let button = copyButtons[i];
						button.addEventListener('click', event => {
							let documentId = event.target.getAttribute('data-docId');
							let link = `${location.origin}/send/?id=${documentId}`;

							copyToClipboard(link);
							document.querySelector('#demo-toast-example').MaterialSnackbar.showSnackbar({
								message: "Link copied to clipboard!"
							});
						});
					}

					document.getElementById('inbox').hidden = false;
					document.getElementById('loadingScreen').hidden = true;
				} else {
					console.log(`Waiting for ${desiredLength} items, currently have ${userPolls.length}`);
				}
			}, 100);
		}
	}).catch(err => {
		console.error(err);
	});
}

firebase.auth().onAuthStateChanged(function(u) {
	if (u) {
		console.log('Calling init function');
		init();
	} else {
		console.error('No current user found');
		location.replace('/');
	}
});

// pollList.innerHTML += buildListItem("Ask me something", new Date(), "0123456789abcdef", 0);
