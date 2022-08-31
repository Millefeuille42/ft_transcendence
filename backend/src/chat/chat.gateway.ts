import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
  } from '@nestjs/websockets';
import { HttpException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { json } from 'stream/consumers';
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import { UserService } from "../user/user.service";
import { User } from "../user/user.interface";
import { ItemsService } from "../items/items.service";
import { channel } from 'diagnostics_channel';

interface Chiasse {
	message: String,
	user: String
}

  @WebSocketGateway({ cors: true })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server;
	users: number = 0;
	configService: ConfigService;

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

	  @SubscribeMessage('ping')
	  async onPing(client) {
		  try {
			  client.broadcast.emit('chat', "pong");
			  console.log("Pong")
		  } catch (e) {
			  console.log(e);
			  return e;
		  }
	  }

	@SubscribeMessage('verify')
	async onVerify(client: string, message: string) {
		let verifyUser = new Map<string, string>([]);
		verifyUser[client] = false;
		const payload = {
			grant_type: "authorization_code",
			client_id: this.configService.get<string>('API_UID'),
		};
		// Requete sur /verify/:login de l'api REST
		await axios ({
			method: "post",
			url: this.configService.get<string>('API') + "/verify/:login",
			data: JSON.stringify(payload),
			headers: {
				"content-type": "application/json",
			}
		})
		.then(function(res) {
		verifyUser[client] = true;
		})
		.catch ((err) => {
			throw new HttpException(err.response.statusText + " on token grab", err.response.status);
		});
		return verifyUser[client];
		// Si ca te dit OK, la personne existe tout va bien
		// dans ta map[socket]boolean tu met l'entree client a true // map[client] =  true
		// et tu retourne "tout va bien"
	}
  }

//   id channel
//   message
