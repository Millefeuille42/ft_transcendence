import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
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
		if (await this.channelRepository.findOneBy({name: newChannel.name}))
			throw new ConflictException("Name is already used")
		const user = await this.userService.getUser(newChannel.owner)
		let pass = ""
		if (newChannel.public === false && newChannel.password) {
			console.log(newChannel.password)
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

	async joinChannel(channel: string, login: string, password: string) {
		const chan = await this.getChannel(channel)
		const user = await this.userService.getUser(login)

		if (await this.isInChannel(channel, login))
			throw new ConflictException('User is already in the channel')
		if (chan.public === false) {
			if (chan.password === "")
				throw new UnauthorizedException("Channel is private")
			if (!await bcrypt.compare(password, chan.password))
				throw new BadRequestException("Password ")
		}
		chan.users = [...chan.users, user]
	}

	async isPublic(channel: string) {
		const chan = await this.getChannel(channel)
		if (chan.public) {
			return {
				isPublic: true,
				isPass: false
			}
		}
		if (chan.password === "")
			return {
				isPublic: false,
				isPass: false
			}
		return {
			isPublic: false,
			isPass: true
		}
	}
}
