import {
	BadRequestException,
	ConflictException,
	forwardRef,
	HttpException,
	HttpStatus, Inject,
	Injectable, OnModuleInit
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
				private blockedService: BlockedService) {}

	connectSession = new Map<string, string>([]);
	connectUUID = new Map<string, string>([])
	onlinePeople: OnlineDto[] = []

	async onModuleInit(): Promise<void> {
		if (await this.userExist("tester")) {
			let user = await this.getUser("tester")
			await this.changeOnlineInDB({login: "tester", online: user.online})
		}
		if (await this.userExist("patate")) {
			let user = await this.getUser("patate")
			await this.changeOnlineInDB({login: "patate", online: user.online})
		}
		console.log('Patate and Tester are online (or not)')
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
		if (await this.usersListRepository.findOneBy({login: user.login}))
			throw new ConflictException("Login is already used")
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
		this.changeOnlineInDB({login: user.login, online: true})
		return await this.usersListRepository.findOneBy({login: user.login})
	}

	async deleteUser(login: string) {
		const user = await this.getUser(login)
		return await this.usersListRepository.delete(user.id)
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
		console.log("Login : " + login)
		console.log("Token : " + this.connectSession.get(login))
		console.log("uuid : " + this.connectUUID.get(login))
	}

	async getUser(login: string) {
		return await this.verificationUser(login) ;
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
		else
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
		console.log (this.usersListRepository.findOneBy({id: user.id}))
	}

	//TODO Chercher dans la db
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
				users.push({info: {login: ulogin, username, avatar, banner, stats }, friend})
			}
		}
		return (users);
	}

	async disconnectUser(login: string) {
		await this.verificationUser(login)
		await this.changeOnline(login, {online: false})
		await this.deleteUuidSession(login)
		await this.deleteToken(login) //TODO demander si faut vraiment le supp
		return ("user disconnected")
	}

}
