import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
  } from '@nestjs/websockets';
import { ConfigService } from "@nestjs/config";

  @WebSocketGateway({ cors: true })
  export class MultiGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server;
	users: number = 0;
	configService: ConfigService;

	async handleConnection() {
	  // A client has connected
	  this.users++;
	  console.log("New connection")

	  // Notify connected clients of current users
	  this.server.emit('users', this.users);
	}

	async handleDisconnect() {
	  // A client has disconnected
	  this.users--;
		console.log("Goodbye")

	  // Notify connected clients of current users
	  this.server.emit('users', this.users);
	}

	//@SubscribeMessage('rodGet')
	//async rod(client: string, data: string) {
	//	try {
	//		client.emit('chat', message)
	//		client.broadcast.emit('chat', message);
	//	} catch (e) {
	//		console.log(e);
	//		return e;
	//	}
	//}

	@SubscribeMessage('rodGet')
	async ball(client: string, data: string) {

	}
  }

//   id channel
//   message
