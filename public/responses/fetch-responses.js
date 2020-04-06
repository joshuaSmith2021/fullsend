function getParameters(){var t=window.location.href.split("?");if(1===t.length)return null;var r,e=t[1].split("&"),l="{",n="";for(r=0;r<e.length;r++)n=e[r].split("="),0<r&&(l+=","),isNaN(n[1])?"true"===n[1]||"false"===n[1]?l+='"'+n[0]+'":'+n[1]:l+='"'+n[0]+'":"'+n[1]+'"':l+='"'+n[0]+'":'+n[1];return l+="}"}

// should have 1 parameter: id, which is the 16 hexadecimal
// string representing the responses document reference
const parameters = JSON.parse(getParameters());
const responseDoc = parameters.id;

function buildResponse(text, creation) {
	const months = ['January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'];

	const buildDate = (date) => {
		let hour = date.getHours();
		let timeString = String([12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
					 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11][hour]);

		timeString += ':';

		let minute = date.getMinutes();
		timeString += (minute > 9) ? String(minute) : `0${minute}`;

		timeString += (hour > 11) ? 'pm' : 'am';

		let calendar = `${months[date.getMonth()]} ${date.getDate()}`;

		return {
			timeString: timeString,
			calendarDay: calendar
		};
	};

	let fancyDate = buildDate(creation);

	return `<li class="mdl-list__item mdl-list__item--three-line"><span class="mdl-list__item-primary-content"><i class="material-icons mdl-list__item-avatar" style="background:none;color:#757575;">comment</i><span>${text}</span><span class="mdl-list__item-text-body">Sent on ${fancyDate.calendarDay} at ${fancyDate.timeString}</span></span></li>`;
}


function init() {
	console.log('Init function called');
	// Get data from firestore
	const user = firebase.auth().currentUser;
	const uid  = user.uid;
	const firestore = firebase.firestore();

	const responseList = document.querySelector('#responseList');

	firestore.collection('responses').doc(responseDoc).get().then(doc => {
		let data = doc.data();
		let responses = data.responses

		for (let i = 0; i < responses.length; i++) {
			let current = responses[i];
			let resText = current.text;
			let d = new Date(0);
			d.setUTCSeconds(current.sent.seconds);
			responseList.innerHTML += buildResponse(resText, d);
		}
	}).catch(err => {
		console.error(err);
	});
}


firebase.auth().onAuthStateChanged(function(u) {
	if (u) {
		console.log('User logged in, calling init function');
		init();
	} else {
		console.log('No current user found, calling init function');
		init();
	}
});
