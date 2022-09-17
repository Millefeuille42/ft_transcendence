import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {RealChannelEntity} from "../entities/realChannel.entity";
import {Repository} from "typeorm";
import {CreateChannelDto} from "./create-channel.dto";
import {UserService} from "../user/user.service";
import * as bcrypt from "bcrypt"

@Injectable()
export class ChatService {
	constructor(@InjectRepository(RealChannelEntity)
				private channelRepository: Repository<RealChannelEntity>,
				private userService: UserService) {}

	async createChannel(newChannel: CreateChannelDto) {
		if (!newChannel.name || !newChannel.hasOwnProperty('public') ||
		!newChannel.owner)
			throw new BadRequestException()
		const user = await this.userService.getUser(newChannel.owner)
		let pass = ""
		if (!newChannel.public && newChannel.password) {
			const salt = await bcrypt.genSalt()
			pass = await bcrypt.hash(newChannel.password, salt)
		}

		const channel = {
			name: newChannel.name,
			public: newChannel.public,
			password: pass,
			ownerId: user.id,
			adminId: [user.id],
			users: [user]
		}
		return await this.channelRepository.save(channel)
	}

	async getChannel(channel: string) {
		const chan = await this.channelRepository.findOneBy({name: channel})
		if (!chan)
			throw new NotFoundException()
		return chan
	}

	async isInChannel(channel: string, login: string) {
		const chan = await this.getChannel(channel)
		const user = await this.userService.getUser(login)

		if (chan.users.find((u) => u === user))
			return true
		return false
	}

	async joinChannel(channel: string, login: string, password?: string) {
		const chan = await this.getChannel(channel)
		const user = await this.userService.getUser(login)

	}
}
