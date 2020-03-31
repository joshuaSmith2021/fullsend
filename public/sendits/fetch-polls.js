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
		
		let calendar = `${months[date.getMonth()]} ${date.getDay() + 1}`;
		
		return {
			timeString : timeString,
			calendarDay: calendar
		}
	}
	
	let fancyDate = buildDate(creation);

	return `<li class="mdl-list__item mdl-list__item--three-line"><span class="mdl-list__item-primary-content"><i class="material-icons mdl-list__item-avatar">poll</i><span>Ask me something!</span><span class="mdl-list__item-text-body">Created on ${fancyDate.calendarDay} at ${fancyDate.timeString}</span></span><span class="mdl-list__item-secondary-content"><a class="mdl-list__item-secondary-action" id="tt${i}"><i class="material-icons copyLinkButton" data-docId="${docId}">link</i></a><div class="mdl-tooltip" data-mdl-for="tt${i}">Copy Share Link</div></span></li>`;
}

function init() {
	// Get data from firestore
	const user = firebase.auth().currentUser;
	const uid  = user.uid;
	const firestore = firebase.firestore();

	firestore.collection('users').doc(uid).get().then(doc => {
		let data = doc.data();
		let pollIds = data.sendits;

		if (typeof pollIds !== "object") {
			pollIds = null;
		} else if (pollIds.length === 0) {
			pollIds = null;
		}

		if (pollIds == null) {
			// Create a no polls message or something, idk
		} else {
			desiredLength = pollIds.length;
			for (let i = 0; i < pollIds.length; i++) {
				let currentId = pollIds[i];
				firestore.collection('sendits').doc(currentId).get().then(document => {
					let pollData = document.data();

					userPolls.append({
						question : pollData.question,
						timestamp: polldata.created,
						username : polldata.creator
					});
				}).catch(err => {
					console.error(err);
				});
			}

			const checkForCompletion = setInterval(function() {
				if (userPolls.length === desiredLength) {
					clearInterval(checkForCompletion);
					console.log(userPolls);
				}
			});
		}

		userPolls = pollIds;
	}).catch(err => {
		console.error(err);
	});
}

function renderList() {
	// add list items for each poll to document
}

firebase.auth().onAuthStateChanged(function(u) {
	if (u) {
		init();
	}
});

pollList.innerHTML += buildListItem("Ask me something", new Date(), "0123456789abcdef", 0);

// First, add list rows to DOM


const copyButtons = document.getElementsByClassName('copyLinkButton');

for (let i = 0; i < copyButtons.length; i++) {
	let button = copyButtons[i];
	button.addEventListener('click', event => {
		let documentId = event.target.getAttribute('data-docId');
		let link = `${location.origin}/send/?${documentId}`;
		
		copyToClipboard(link);
		document.querySelector('#demo-toast-example').MaterialSnackbar.showSnackbar({
			message: "Link copied to clipboard!"
		});
	});
}
