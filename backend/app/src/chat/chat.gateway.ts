import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	ConnectedSocket,
	MessageBody
  } from '@nestjs/websockets';
import { ConfigService } from "@nestjs/config";
import {Socket} from "socket.io";
import {UserService} from "../user/user.service";
import {AuthService} from "../auth/auth.service";
import {ChatService} from "./chat.service";
import {ForbiddenException, NotFoundException} from "@nestjs/common";

interface authData {
	token: string,
	login: string
}

interface messageData {
	channel: string,
	message: string,
}

  @WebSocketGateway({ cors: true })
  export class ChatGateway {
	constructor(private userService: UserService,
				private authService: AuthService,
				private chatService: ChatService) {}

	@WebSocketServer() server;
	users: number = 0;
	sockUser = new Map<string, string>([])

	async handleConnection(client: Socket) {
		console.log("New connection")
		console.log(client.id)
		if (this.sockUser[client.id])
			this.server.emit('error', "Socket already used")
		else
			this.sockUser[client.id] = ""
	}

	async handleDisconnect(client: Socket) {
		console.log("Goodbye")
		if (!this.sockUser[client.id])
			this.server.emit('error', "Socket isn't use")
		else
			this.sockUser.delete(client.id)
	}

	@SubscribeMessage('auth')
	async handleAuth (@MessageBody() data: authData, @ConnectedSocket() client: Socket) {
		const ret = await this.authService.isAuth(data.login, data.token)
		console.log(data.login, data.token)
		this.server.emit('auth', ret)
		if (ret === true)
			this.sockUser[client.id] = data.login
		console.log(client.id, this.sockUser[client.id])
	}

	@SubscribeMessage('message')
	async handleEvent (@MessageBody() data: messageData, @ConnectedSocket() client: Socket) {
		try {
			if (!this.sockUser[client.id])
				throw new NotFoundException("Socket doesn't exist")
			if (this.sockUser[client.id] === "")
				throw new NotFoundException("Socket isn't link with a user")
			const user = await this.userService.getUser(this.sockUser[client.id])
			//if (await this.chatService.isInChannel(data.channel, user.login))
			//	throw new ForbiddenException("User is not in the channel")

			const payload = {
				login: user.login,
				message: data.message,
				avatar: user.avatar,
				username: user.username,
				channel: data.message
			}
			console.log(payload)
			this.server.emit('message', payload)
		}
		catch (e) {
			this.server.emit('error', e)
		}
	}

	@SubscribeMessage('join')
	  async joinChannel(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
		try {
			if (!this.sockUser[client.id])
				throw new NotFoundException("Socket doesn't exist")
			if (this.sockUser[client.id] === "")
				throw new NotFoundException("Socket isn't link with a user")
			await this.chatService.joinChannel(data.channel, this.sockUser[client.id])
			this.server.emit('join', {
				login: this.sockUser[client.id],
				channel: data.message
			})
		}
		catch (e) {
			this.server.emit('error', e)
		}
	}
  }

//   id channel
//   message
