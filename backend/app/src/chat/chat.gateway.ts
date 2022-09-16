import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	ConnectedSocket,
	OnGatewayConnection,
	OnGatewayDisconnect,
	MessageBody,
  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import {UserService} from "../user/user.service";
import {ChatService} from "./chat.service";
import {Request} from 'express'

  @WebSocketGateway({
	  cors: {
		  origin: "*"
	  }
  })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private userService: UserService,
				private chatService: ChatService){}

	  @WebSocketServer()
	  server: Server;
	  users: number = 0;

	  //Connection
	  async handleConnection(client: Socket, req: Request) {
		  console.log(req)
		  //let cookies = client.handshake.headers.cookie
		  //console.log(cookies)
	  }

	  async handleDisconnect(client: Socket) {
		  // A client has disconnected
		  this.users--;
		  console.log("Goodbye:", client.id)

		  // Notify connected clients of current users
		  //this.server.emit('users', this.users);
	  }

	  @SubscribeMessage('message')
	  async handleEvent(@MessageBody() data: string,
						@ConnectedSocket() client: Socket) {
		  console.log(data)
		  this.server.emit('message', client.id, data)
	  }


	  // async onChat(client, message) {
		//   console.log(message)
		//   try {
		// 	  client.emit('chat', message)
		// 	  client.broadcast.emit('chat', message);
		//   } catch (e) {
		// 	  console.log(e);
		// 	  return e;
		//   }
	  // }
  }
//   id channel
//   message
