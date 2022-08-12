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
	async onVerify(client: string, message: string) {
		let verifyUser = new Map<string, string>([]);
		verifyUser[client] = false;
		// Requete sur /verify/:login de l'api REST
		try {
			await axios.get(process.env.VUE_APP_BACK_URL + "/verify/:login").
			then(() => { verifyUser[client] = true });
		} catch (e) {
			throw ("Error : Profile don't exist");
		}
		// Si ca te dit OK, la personne existe tout va bien
		// dans ta map[socket]boolean tu met l'entree client a true // map[client] =  true
		// et tu retourne "tout va bien"
	} 
  } 