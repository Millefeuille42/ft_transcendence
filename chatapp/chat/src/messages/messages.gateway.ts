import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})

export class MessagesGateway {
	@WebSocketServer()
	server: Server;

	constructor(private readonly messagesService: MessagesService) {}

	@SubscribeMessage('createMessage')
	async (@MessageBody() createMessageDto: CreateMessageDto) {
		const message = this.messagesService.create(createMessageDto);
		this.server.emit('message', message);
		return message;
	}

	@SubscribeMessage('findAllMessages')
	findAll() {
		return this.messagesService.findAll();
	}

	@SubscribeMessage('join')
	joinRoom(@MessageBody('name') name: string, @ConnectedSocket() client: Socket) {
		return this.messagesService.identify(name, client.id)
	}

	@SubscribeMessage('typing')
	async typing(@MessageBody('isTyping') isTyping: boolean, @ConnectedSocket() client: Socket) {
		const name = await this.messagesService.getClientName(client.id);
		client.broadcast.emit('typing', {name, isTyping});
	}

//   @SubscribeMessage('findOneMessage')
//   findOne(@MessageBody() id: number) {
//     return this.messagesService.findOne(id);
//   }

//   @SubscribeMessage('updateMessage')
//   update(@MessageBody() updateMessageDto: UpdateMessageDto) {
//     return this.messagesService.update(updateMessageDto.id, updateMessageDto);
//   }

//   @SubscribeMessage('removeMessage')
//   remove(@MessageBody() id: number) {
//     return this.messagesService.remove(id);
//   }
}
