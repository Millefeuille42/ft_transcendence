import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../chat.entity';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Chat)
		private userRepository: Repository<Chat>,
	) { }

	async  findByEmail(email: string): Promise<Chat> {
		return await this.userRepository.findOne({
			where: {
				email: email,
			}
		});
	}

	async  create(user: Chat): Promise<Chat> {
		return await this.userRepository.save(user);
	}
}