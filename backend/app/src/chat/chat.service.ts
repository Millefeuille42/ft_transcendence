import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {RealChannelEntity} from "../entities/realChannel.entity";
import {In, Repository} from "typeorm";
import {CreateChannelDto} from "./create-channel.dto";
import {UserService} from "../user/user.service";
import * as bcrypt from "bcrypt"
import {DmChannelEntity} from "../entities/dmChannel.entity";
import {MessagesEntity} from "../entities/messages.entity";
import {BlockedService} from "../blocked/blocked.service";

@Injectable()
export class ChatService {
	constructor(@InjectRepository(RealChannelEntity)
				private channelRepository: Repository<RealChannelEntity>,
				private userService: UserService,
				@InjectRepository(DmChannelEntity)
				private dmRepository: Repository<DmChannelEntity>,
				@InjectRepository(MessagesEntity)
				private messageRepository: Repository<MessagesEntity>,
				private blockedService: BlockedService) {}

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
			users: [user.id]
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

		if (chan.users.find((u) => u === user.id))
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
		chan.users.push(user.id)
		await this.channelRepository.save(chan)
	}

	async leaveChannel(channel: string, login: string) {
		const chan = await this.getChannel(channel)
		const user = await this.userService.getUser(login)

		if (!await this.isInChannel(channel, login))
			throw new ConflictException('User is not in the channel')
		chan.users = chan.users.filter((u) => u !== user.id)
		await this.channelRepository.save(chan)
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

	async createDM(users: number[]) {
		if (users.length != 2)
			throw new BadRequestException("Dm need 2 users")

		const chans = await this.dmRepository.find() //Tester avec In
		let chan
		chans.forEach((c) => {
			console.log(c);
			if ((c.users[0] === users[0] && c.users[1] === users[1])
			|| (c.users[1] === users[0] && c.users[0] === users[1])) {
				chan = c
				return;
			}
		})
		if (chan)
			return chan
		chan = {
			users: users
		}
		return await this.dmRepository.save(chan)
	}

	async sendDM(from: string, to: string, message: string) {
		if (to === from)
			throw new ConflictException("You can\'t DM yourself")
		const uFrom = await this.userService.getUser(from)
		const uTo = await this.userService.getUser(to)
		if (await this.blockedService.isBlocked(from, to)
			|| await this.blockedService.isBlocked(to, from))
			throw new ConflictException("Someone blocked the other")
		const chan = await this.createDM([uFrom.id, uTo.id])
		await this.addMessage(uFrom.id, "dm", message, chan.id)
	}

	async addMessage(from: number, type: string, message: string, roomId: number) {
		const mess = {
			userId: from,
			type: type,
			roomId: roomId,
			content: message
		}
		return await this.messageRepository.save(mess)
	}

	async getAllChannels() {
		return this.channelRepository.find()
	}

	async getDm(login: string, other: string) {
		const user = await this.userService.getUser(login)
		const userO = await this.userService.getUser(other)

		const chans = await this.dmRepository.find() //Tester avec In
		let chan
		chans.forEach((c) => {
			console.log(c);
			if ((c.users[0] === user.id && c.users[1] === userO.id)
				|| (c.users[1] === userO.id && c.users[0] === user.id)) {
				chan = c
				return;
			}
		})

		if (!chan)
			throw new NotFoundException("Dm doesn't exist")

		return chan
	}

	async getChannelsOfUser(login: string) {
		const user = await this.userService.getUser(login)

		return await this.channelRepository.find({where: {users: In[user.id]}})
	}

	async getDmOfUser(login) {
		const user = await this.userService.getUser(login)

		return await this.dmRepository.find({where: {users: In[user.id]}})
	}

	async getBanList(channel: string) {

	}

	async getMuteList(channel: string) {

	}

	async getAdminList(channel: string) {
		const chan = await this.getChannel(channel)
		const adminsId = chan.adminId

		let admins = []
		for (const id of adminsId) {
			admins.push(await this.userService.getUserById(id))
		}
		return admins
	}
}
