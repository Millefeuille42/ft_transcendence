import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
  } from '@nestjs/websockets';
import { json } from 'stream/consumers';
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';

  
interface Chiasse {
	message: String,
	user: String
}

  @WebSocketGateway({ cors: true })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server;
	users: number = 0;
  
	async handleConnection() {
	  // A client has connected
	  this.users++;
  
	  // Notify connected clients of current users
	  this.server.emit('users', this.users);
	}
  
	async handleDisconnect() {
	  // A client has disconnected
	  this.users--;
  
	  // Notify connected clients of current users
	  this.server.emit('users', this.users);
	}

	@SubscribeMessage('chat')
	async onChat(client, message) {
		try {
			let messageData: Chiasse = JSON.parse(message);
			client.broadcast.emit('chat', message);
		} catch (e) {
			console.log(e);
			return e;
		}
	}

	@SubscribeMessage('verify')
	async onVerify(client, message) {
		// Requete sur /verify/:login de l'api REST
		try {
			axios
				.get('https://api.com/verify/:login')
				.then(response => (this.info = response))
		} catch (e) {
			console.log(e);
			return e;
		}
		// Si ca te dit OK, la personne existe tout va bien
		// dans ta map[socket]boolean tu met l'entree client a true // map[client] =  true
		// et tu retourne "tout va bien"
		// Sinon tu retourne "ntm"
	} 
  } 