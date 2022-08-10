const socket = io('http://localhost:3000');
const msgBox = document.getElementById('exampleFormControlTextarea1');
const msgCont = document.getElementById('data-container');
const email = document.getElementById('email');

const messages = [];
function getMessages() {
	fetch('http://localhost:3000/api/chat')
		.then((response) => response.json())
		.then((data) => {
			loadDate(data);
			data.forEach((el) => {
				messages.push(el);
			});
		})
		.catch((err) => console.error(err));
}
getMessages();

msgBox.addEventListener('keydown', (e) => {
	if (e.key === 13) {
		sendMessage({ email: email.value, text: e.target.value });
		e.target.value = '';
	}
});

function loadDate(data) {
	let messages = '';
	data.map((message) => {
		messages += ` ${message.email}
		${message.text}`;
	})
	msgCont.innerHTML = messages;
}

function sendMessage(message) {
	socket.emit('sendMessage', message);
}

socket.on('recMessage', (message) => {
	messages.push(message);
	loadDate(messages);
})