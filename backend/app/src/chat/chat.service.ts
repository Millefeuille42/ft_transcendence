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
import {ChangePrivacyDto} from "./change-privacy.dto";
import {MuteUserEntity} from "../entities/muteUser.entity";
import {BanUserEntity} from "../entities/banUser.entity";
@Injectable()
export class ChatService {
	constructor(@InjectRepository(RealChannelEntity)
				private channelRepository: Repository<RealChannelEntity>,
				private userService: UserService,
				@InjectRepository(DmChannelEntity)
				private dmRepository: Repository<DmChannelEntity>,
				@InjectRepository(MessagesEntity)
				private messageRepository: Repository<MessagesEntity>,
				private blockedService: BlockedService,
				@InjectRepository(MuteUserEntity)
				private muteRepository: Repository<MuteUserEntity>,
				@InjectRepository(BanUserEntity)
				private banRepository: Repository<BanUserEntity>,) {}

	async createChannel(newChannel: CreateChannelDto) {
		if (!newChannel.name || !newChannel.hasOwnProperty('public') ||
		!newChannel.owner)
			throw new BadRequestException()
		if (await this.channelRepository.findOneBy({name: newChannel.name}))
			throw new ConflictException("Name is already used")
		const user = await this.userService.getUser(newChannel.owner)
		let pass = ""
		if (newChannel.public === false && (newChannel.password && newChannel.password !== "")) {
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
			users: [user.id],
			messages: []
		}
		return await this.channelRepository.save(channel)
	}

	async getChannel(channel: string) {
		const chanc = await this.channelRepository.find({where: {name: channel}, relations: ['messages']})
		if (!chanc || chanc.length <= 0 || chanc.length > 1)
			throw new NotFoundException("Channel not found")
		const chan = chanc[0]
		let p = await this.isPublic(chan.name)

		let ret = {
			id: chan.id,
			name: chan.name,
			public: p.isPublic,
			pass: p.isPass,
			owner: (await this.userService.getUserById(chan.ownerId)).login,
			admins: await this.getAdminList(channel),
			users: [],
			messages: chan.messages
		}

		for (const user of chan.users) {
			ret.users.push((await this.userService.getUserById(user)).login)
		}

		return ret
	}

	async isInChannel(channel: string, login: string) {
		const chan = await this.getChannel(channel)
		const user = await this.userService.getUser(login)

		if (chan.users.find((u) => u === user.login))
			return true
		return false
	}

	async joinChannel(channel: string, login: string, password: string) {
		const chan = await this.channelRepository.findOneBy({name: channel})
		if (!chan)
			throw new NotFoundException("Channel not found")
		const user = await this.userService.getUser(login)

		if (await this.isInChannel(channel, login))
			throw new ConflictException('User is already in the channel')
		if (chan.public === false) {
			if (chan.password === "")
				throw new UnauthorizedException("Channel is private")
			if (!password || password === "")
				throw new BadRequestException("Channel need a password")
			if (!await bcrypt.compare(password, chan.password))
				throw new BadRequestException("Password is not good")
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
		const chan = await this.channelRepository.findOneBy({name: channel})
		if (!chan)
			throw new NotFoundException()
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

		const chans = await this.dmRepository.find({relations: ['messages']})
		let chan
		chans.forEach((c) => {
			if ((c.users[0] === users[0] && c.users[1] === users[1])
			|| (c.users[1] === users[0] && c.users[0] === users[1])) {
				chan = c
				return;
			}
		})
		if (chan)
			return chan
		chan = {
			users: users,
			messages: []
		}
		return await this.dmRepository.save(chan)
	}

	async sendMessage(from: string, channel: string, message: string) {
		const user = await this.userService.getUser(from)
		if (!await this.isInChannel(channel, from))
			throw new UnauthorizedException("User is not in the channel")

		const chan = (await this.channelRepository.find({where: {name: channel}, relations: ['messages']}))[0]
		const mess = await this.addMessage(user.id, "channel", message, chan.id)
		chan.messages.push(mess)
		await this.channelRepository.save(chan)
		return mess
	}

	async sendDM(from: string, to: string, message: string) {
		if (to === from)
			throw new ConflictException("You can\'t DM yourself")
		const uFrom = await this.userService.getUser(from)
		const uTo = await this.userService.getUser(to)
		if (await this.blockedService.isBlocked(from, to)
			|| await this.blockedService.isBlocked(to, from))
			throw new ConflictException("Someone blocked the other")
		let chan = await this.createDM([uFrom.id, uTo.id])
		const mess: MessagesEntity = await this.addMessage(uFrom.id, "dm", message, chan.id)

		chan.messages.push(mess)
		await this.dmRepository.save(chan)
	}


	async addMessage(from: number, type: string, message: string, roomId: number) {
		const mess = {
			userId: from,
			userLogin: (await this.userService.getUserById(from)).login,
			type: type,
			roomId: roomId,
			content: message
		}
		return this.messageRepository.save(mess)
	}

	async getAllChannels() {
		const allChan = await this.channelRepository.find()

		let ret = []

		for (const chan of allChan) {
			ret.push(chan.name)
		}

		return ret
	}

	async getDm(login: string, other: string) {
		const user = await this.userService.getUser(login)
		const userO = await this.userService.getUser(other)

		const chans = await this.dmRepository.find({relations: ['messages']})
		let chan
		for (const ch of chans) {
			if ((ch.users[0] === user.id && ch.users[1] === userO.id)
				|| (ch.users[1] === user.id && ch.users[0] === userO.id)) {
				chan = ch
				break ;
			}
		}
		if (!chan)
			throw new NotFoundException("Dm doesn't exist")

		return chan
	}

	async getChannelsOfUser(login: string) {
		const user = await this.userService.getUser(login)

		const channels = await this.channelRepository.find()
		let ret = {
			thereIsChannel: true,
			channels: []
		}
		for (const chan of channels){
			for (const u of chan.users) {
				if (u === user.id) {
					const p = await this.isPublic(chan.name)

					ret.channels.push({
						id: chan.id,
						name: chan.name,
						public: p.isPublic,
						pass: p.isPass
					})
				}
			}
		}

		if (!ret.channels || ret.channels.length <= 0)
			return {thereIsChannel: false}

		return ret
	}

	async getDmOfUser(login) {
		const user = await this.userService.getUser(login)

		const dms = await this.dmRepository.find()
		let ret = {
			thereIsDm: true,
			dms: []
		}

		for (const dm of dms) {
			if (dm.users[0] === user.id)
				ret.dms.push({
					id: dm.id,
					user: (await this.userService.getUserById(dm.users[1])).login
				})
			if (dm.users[1] === user.id)
				ret.dms.push({
					id: dm.id,
					user: (await this.userService.getUserById(dm.users[0])).login
				})
		}

		if (!ret.dms || ret.dms.length <= 0)
			return {thereIsDm: false}
		return ret
	}

	async getBanList(channel: string) {

	}

	async getMuteList(channel: string) {
		const chan = await this.channelRepository.findOne({where: {name: channel}, relations: ['mute']})
		let listOfMuted = []
		for (const u of chan.mute) {
			listOfMuted.push(await this.userService.getUserById(u.userId))
		}
		return (listOfMuted)
	}

	async addAdmin(channel: string, login: string, newAdmin: string) {
		const chan = await this.channelRepository.findOneBy({name: channel})
		if (!chan)
			throw new NotFoundException("Channel not found")
		const user = await this.userService.getUser(login)
		const userNew = await this.userService.getUser(newAdmin)
		if (user.id !== chan.ownerId)
			throw new UnauthorizedException("Only the owner can add admins")
		chan.adminId.push(userNew.id)
		return await this.channelRepository.save(chan)
	}

	async getAdminList(channel: string) {
		const chan = await this.channelRepository.findOneBy({name: channel})
		if (!chan)
			throw new NotFoundException("Channel not found")
		const adminsId = chan.adminId

		let admins = []
		for (const id of adminsId) {
			admins.push(await this.userService.getUserById(id))
		}
		return admins
	}

	async isChannel(channel: string) {
		const chan = await this.channelRepository.findOneBy({name: channel})
		if (chan)
			return true
		return false
	}

	async changePrivacy(channel: string, change: ChangePrivacyDto) {
		const chan = await this.channelRepository.findOneBy({name: channel})
		const user = await this.userService.getUser(change.login)
		if (chan.ownerId !== user.id)
			throw new UnauthorizedException("Only owner chan change privacy of channel")
		chan.public = change.public
		if (chan.public === true)
			chan.password = ""
		if (chan.public === false && (change.password && change.password !== "")) {
			const salt = await bcrypt.genSalt()
			chan.password = await bcrypt.hash(change.password, salt)
		}
		return await this.channelRepository.save(chan)
	}

	async isAdmin(channel: string, login: string) {
		const admins = await this.getAdminList(channel)
		for (const admin of admins) {
			if (admin.login === login)
				return true
		}
		return false
	}

	async checkMute() {
		let list = []
		const allMute = await this.muteRepository.find({relations: ['channel']})
		for (const m of allMute) {
			let now = new Date()
			if (now >= m.endOfMute)
				list.push({channel: m.channel.name, login: (await this.userService.getUserById(m.userId)).login})
		}
		return list
	}

	async muteSomeone(channel: string, login: string, loginMute: string, until: Date) {
		const chan = await this.channelRepository.findOne({where: {name: channel}, relations: ['mute']})
		const user = await this.userService.getUser(login)
		const userMute = await this.userService.getUser(loginMute)
		if (!await this.isAdmin(channel, login))
			throw new UnauthorizedException("Only admin can mute someone")
		if (login === loginMute)
			throw new UnauthorizedException("You can't mute yourself")
		if (await this.isAdmin(channel, loginMute))
			throw new UnauthorizedException("You can't mute an admin")
		if (!await this.isInChannel(channel, login))
			throw new UnauthorizedException("Target is not in the channel")
		if (chan.mute.find((u) => u.userId === userMute.id))
			throw new ConflictException("User is already muted")
		const now = new Date()
		if (now >= until)
			throw new ConflictException("Date can't be in past")

		const newMute = {
			userId: userMute.id,
			endOfMute: until,
			channel: chan
		}
		await this.muteRepository.save(newMute)
	}

	async unMute(channel: string, login: string) {
		const chan = await this.channelRepository.findOne({where: {name: channel}, relations: ['mute']})
		const user = await this.userService.getUser(login)

		const mute = chan.mute.find((u) => u.userId === user.id)
		if (!mute)
			throw new NotFoundException("User isn't muted")
		await this.muteRepository.delete(mute.id)
	}
}
