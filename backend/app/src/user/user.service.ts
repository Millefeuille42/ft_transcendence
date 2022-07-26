import {
	BadRequestException,
	ConflictException,
	forwardRef,
	HttpException,
	HttpStatus, Inject,
	Injectable, NotFoundException, OnModuleInit, UnauthorizedException
} from '@nestjs/common';
import { User } from "./user.interface";
import {CreateUser, CreateUserDto} from "./create-user.dto";
import {OnlineDto} from "./online.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {UsersList} from "../entities/users.entity";
import {Repository} from "typeorm";
import {ItemsService} from "../items/items.service";
import {GameService} from "../game/game.service";
import {FriendsService} from "../friends/friends.service";
import {BlockedService} from "../blocked/blocked.service";
import {UserGlobal} from "./user.interface";
import {v4 as uuid} from 'uuid'
import {TwoFAEntity} from "../entities/twoFA.entity";
import {authenticator} from "otplib";
import { toDataURL } from 'qrcode'

@Injectable()
export class UserService implements OnModuleInit {

	constructor(@InjectRepository(UsersList) private usersListRepository: Repository<UsersList>,
				@Inject(forwardRef(() => ItemsService))
				private itemService: ItemsService,
				@Inject(forwardRef(() => GameService))
				private gameService: GameService,
				@Inject(forwardRef(() => FriendsService))
				private friendService: FriendsService,
				@Inject(forwardRef(() => BlockedService))
				private blockedService: BlockedService,
				@InjectRepository(TwoFAEntity) private twoFARepository: Repository<TwoFAEntity>) {}

	connectSession = new Map<string, string>([]);
	connectUUID = new Map<string, string>([])
	onlinePeople: OnlineDto[] = []
	inGame: string[] = []

	async onModuleInit(): Promise<void> {
		const allU = await this.usersListRepository.findBy({online: true})
		for (const u of allU) {
			await this.changeOnline(u.login, {online: false})
		}

		if (await this.userExist("tester")) {
			let user = await this.getUser("tester")
			await this.changeOnlineInDB({login: "tester", online: true})
		}
		if (await this.userExist("patate")) {
			let user = await this.getUser("patate")
			await this.changeOnlineInDB({login: "patate", online: true})
		}
	}

	async addInGame(login: string) {
		if (!await this.isInGame(login))
			this.inGame.push(login)
	}

	async removeInGame(login: string) {
		if (await this.isInGame(login))
			this.inGame = this.inGame.filter((u) => u !== login)
	}

	async listInGame() {
		return this.inGame
	}

	async isInGame(login: string) {
		if (this.inGame.find((u) => u === login))
			return true
		return false
	}

	async verificationUser(login: string) {
		const user = (await this.usersListRepository.findOneBy({login: login}))
		if (!user)
			throw new HttpException('User not found', HttpStatus.NOT_FOUND)
		return (user)
	}

	async getAllUsers() {
		return (this.usersListRepository.find())
	}

	async initUser(newUser: CreateUser) {
		const user = {
			login: newUser.login,
			email: newUser.email,
			username: newUser.login,
			name: newUser.name,
			avatar: newUser.avatar,
			banner: "",
			online: true,
		}
		if (await this.usersListRepository.findOneBy({login: user.login})) {
			if (await this.isTwoFA(user.login)) {
				return("2FA Activated, need a code")
			}

			await this.changeOnlineInDB({login: user.login, online: true})
			return("User connected gg")
		}
		const otherLogin = await this.isUsernameExist(user.login)
		if (otherLogin.userExist) {
			const otherUser: CreateUserDto = {username: otherLogin.login}
			await this.changeUsername(otherLogin.login, otherUser)
		}
		await this.itemService.checkItems()
		await this.usersListRepository.save(user)
		await this.itemService.initInventory(user.login)
		await this.itemService.initEquipment(user.login)
		await this.gameService.initStats(user.login)
		await this.changeOnlineInDB({login: user.login, online: true})
		return await this.usersListRepository.findOneBy({login: user.login})
	}

	async checkUser(login: string) {
		const user = this.getUser(login)
		await this.itemService.checkItems()
		let check = await this.itemService.getInventory(login)
		if (!check)
			await this.itemService.initInventory(login)
		let check2 = await this.itemService.getEquipment(login)
		if (!check2)
			await this.itemService.initEquipment(login)
		let check3 = await this.gameService.getStats(login)
		if (!check3)
			await this.gameService.initStats(login)
	}

	async getUUID(login: string) {
		const user = await this.verificationUser(login)
		return (user.id)
	}

	async getUuidSession(login: string) {
		return this.connectUUID.get(login)
	}

	async deleteUuidSession(login: string) {
		this.connectUUID.delete(login)
	}

	async initSession(login: string, token: string) {
		const id: string = uuid()
		this.connectSession.set(login, token);
		this.connectUUID.set(login, id)
	}

	async getUser(login: string) {
		return await this.verificationUser(login) ;
	}

	async getUserByUser(login: string, user: string) {
		const u = await this.getUser(login)
		const uToRet = await this.getUser(user)

		return ({
			avatar: uToRet.avatar,
			username: uToRet.username,
			isBlocked: await this.blockedService.isBlocked(u.login, uToRet.login),
			isFriend: await this.friendService.isFriend(u.login, uToRet.login)
		})
	}

	async getUserById(id: number) {
		const user = await this.usersListRepository.findOneBy({id: id})

		if (!user)
			throw new BadRequestException("User doesn't exist")
		return user
	}

	async userExist(login: string) {
		return await this.usersListRepository.findOneBy({login: login})
	}

	async getName(login: string) {
		const user = await this.getUser(login)
		return {
			name: user.name,
		}
	}

	async getAvatar(login: string) {
		const user = await this.getUser(login)
		return {
			avatar: user.avatar,
		}
	}

	async getMail(login: string) {
		const user = await this.getUser(login)
		return {
			email: user.email,
		}
	}

	async getBanner(login: string) {
		const user = await this.getUser(login)
		return {
			banner: user.banner,
		}
	}

	async getUsername(login: string) {
		const user = await this.getUser(login)
		return {
			username: user.username,
		}
	}

	async isOnline(login: string) {
		const user = await this.getUser(login)
		return (user.online)
	}


	async getToken(login: string) {
		return this.connectSession.get(login);
	}

	async deleteToken(login: string) {
		this.connectSession.delete(login);
	}

	async changeAvatar(login: string, change: User) {
		const user = await this.getUser(login)
		const changeUser = await this.usersListRepository.preload({
			id: user.id,
			avatar: change.avatar
		})
		await this.usersListRepository.save(changeUser);
	}

	async changeBanner(login: string, change: User) {
		const user = await this.getUser(login)
		const changeUser = await this.usersListRepository.preload({
			id: user.id,
			banner: change.banner
		})
		await this.usersListRepository.save(changeUser);
	}


	async changeUsername(login: string, change: User) {
		const user = await this.getUser(login)
		if (change.username.length > 12)
			throw new BadRequestException()
		for (let i = 0; i < change.username.length; i++) {
			let code = change.username.charCodeAt(i);
			if (!(code > 47 && code < 58) && // numeric (0-9)
				!(code > 64 && code < 91) && // upper alpha (A-Z)
				!(code > 96 && code < 123)) { // lower alpha (a-z)
				throw new BadRequestException("Bad characters");
			}
		}
		const loginOtherUser = await this.isUsernameExist(change.username)
		if (loginOtherUser.userExist && user.username !== change.username) {
			if (change.username === login) {
				let otherUser = await this.usersListRepository.findOneBy({login: loginOtherUser.login})
				const newChange: CreateUserDto = {username : otherUser.login}
				await this.changeUsername(otherUser.login, newChange)
			}
			else
				throw new ConflictException()
		}
		const changeUser = await this.usersListRepository.preload({
			id: user.id,
			username: change.username
		})
		await this.usersListRepository.save(changeUser);
	}

	changeOnlineInDB(online: OnlineDto) {
		const user = this.onlinePeople.find(u => u.login === online.login)
		if (user)
			user.online = online.online
		else if (online.online === true)
			this.onlinePeople = [...this.onlinePeople, online];
	}

	async changeOnline(login: string, change: User) {
		const user = await this.getUser(login)
		this.changeOnlineInDB({login: login, online: change.online})
		const changeUser = await this.usersListRepository.preload({
			id: user.id,
			online: change.online
		})
		await this.usersListRepository.save(changeUser);
	}

	async isUsernameExist(username: string): Promise<{userExist: boolean, login?: string}> {
		const user = await this.usersListRepository.findOneBy({username: username})
		if (!user)
			return {userExist: false}
		return {
			userExist: true,
			login: user.login
		}
	}

	async isBlocked(login: string, other: string) {
		if (await this.blockedService.isBlocked(login, other) || await this.blockedService.isBlocked(other, login))
			return true
		return false
	}

	async getStatus(login: string) {
		await this.verificationUser(login)
		let isOnline: boolean = await this.isOnline(login)
		let isInGame: boolean = await this.isInGame(login)
		return {
			status: isOnline ? (isInGame ? "in-game" : "online") : "offline"
		}
	}

	async listOfOnlinePeople(login: string) {
		await this.verificationUser(login)
		let users: {
			info: UserGlobal;
			friend: boolean
		}[] = []
		for (const u of this.onlinePeople) {
			if (u.login !== login && u.online === true && (!await this.isBlocked(login, u.login))) {
				const {username, avatar, login: ulogin, banner} = await this.getUser(u.login)
				const friend = await this.friendService.isFriend(login, u.login)
				const stats = await this.gameService.getStats(u.login)
				const isInGame = await this.isInGame(u.login)
				users.push({info: {login: ulogin, username, avatar, banner, isInGame ,stats }, friend})
			}
		}
		return (users);
	}

	async disconnectUser(login: string) {
		await this.verificationUser(login)
		await this.changeOnline(login, {online: false})
		await this.deleteUuidSession(login)
		await this.deleteToken(login)
		return ("user disconnected")
	}

	async generateTwoFA(login: string) {
		const user = await this.getUser(login)
		const secret = authenticator.generateSecret();

		const otpauthUrl = authenticator.keyuri(user.email, 'FT_Transcendence', secret)
		const newTwoFA = {
			id: user.id,
			twoFASecret: secret,
			isEnabled: false
		}
		await this.twoFARepository.save(newTwoFA)
		let qrCode = await toDataURL(otpauthUrl)
		return {qr: qrCode, code: secret}
	}

	async deleteTwoFA(login: string, code: string) {
		const user = await this.getUser(login)
		if (!await this.twoFAIsValid(login, code))
			throw new UnauthorizedException()
		return await this.twoFARepository.delete(user.id)
	}

	async twoFAIsValid(login: string, code: string) {
		const user = await this.getUser(login)
		const userTwoFA = await this.twoFARepository.findOneBy({id: user.id})
		if (!userTwoFA)
			throw new BadRequestException()
		const isValid = authenticator.verify({
			token: code,
			secret: userTwoFA.twoFASecret
		})
		return (isValid)
	}

	async isTwoFA(login: string) {
		const user = await this.getUser(login)
		const userTwoFA = await this.twoFARepository.findOneBy({id: user.id})
		if (!userTwoFA || userTwoFA.isEnabled === false)
			return false
		return true
	}

	async enabledTwoFA(login: string) {
		const user = await this.getUser(login)
		const userTwoFA = await this.twoFARepository.preload({id: user.id, isEnabled: true})
		return await this.twoFARepository.save(userTwoFA)
	}

}
