import {
	BadRequestException,
	ConflictException,
	forwardRef,
	HttpException,
	HttpStatus, Inject,
	Injectable
} from '@nestjs/common';
import {UserGlobal, User, EFriend, EBlocked, EUser} from "./user.interface";
import {TmpDbService} from "../tmp_db/tmp_db.service";
import {CreateUser, CreateUserDto} from "./create-user.dto";
import {OnlineDto} from "./online.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {UsersList} from "../entities/users.entity";
import {Repository} from "typeorm";
import {FriendsService} from "../friends/friends.service";
import {ItemsService} from "../items/items.service";
import {EStats} from "../game/stats.interface";
import {GameService} from "../game/game.service";

@Injectable()
export class UserService {
	constructor(private tmp_db: TmpDbService,
				@InjectRepository(UsersList) private usersListRepository: Repository<UsersList>,
				@InjectRepository(EFriend) private friendListRepository: Repository<EFriend>,
				@InjectRepository(EBlocked) private blockedListRepository: Repository<EBlocked>,
				@Inject(forwardRef(() => ItemsService))
				private itemService: ItemsService,
				@Inject(forwardRef(() => GameService))
				private gameService: GameService) {}

	connectSession = new Map<string, string>([]);

	async verificationUser(login: string) {
		const user = (await this.usersListRepository.findOneBy({login: login}))
		//console.log(user)
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
		const otherLogin = await this.isUsernameExist(user.login)
		if (otherLogin.userExist) {
			const otherUser: CreateUserDto = {username: otherLogin.login}
			await this.changeUsername(otherLogin.login, otherUser)
		}
		await this.usersListRepository.save(user)
		await this.itemService.initInventory(user.login)
		await this.itemService.initEquipment(user.login)
	}


	async getUUID(login: string) {
		const user = await this.verificationUser(login)
		return (user.id)
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


	getToken(login: string) {
		return this.connectSession.get(login);
	}

	deleteToken(login: string) {
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
		const user = this.tmp_db.onlinePeople.find(u => u.login === online.login)
		if (user)
			user.online = online.online
		else
			this.tmp_db.onlinePeople = [...this.tmp_db.onlinePeople, online];
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
		//let user = await this.getUser(other)
		//if (user.blocked.find(u => u === login))
		//	return true
		//user = await this.getUser(login)
		//if (user.blocked.find(u => u === other))
		//	return true
		//return false
	}

	async isFriend(login: string, other: string) {
		//const user = await this.getUser(login)
		//if (user.friends.find(f => f === other))
		//	return true
		//return false
	}

	async listOfOnlinePeople(login: string) {
		//await this.verificationUser(login)
		//let users: {
		//	info: UserGlobal;
		//	friend: boolean
		//}[] = []
		//for (const u of this.tmp_db.onlinePeople) {
		//	if (u.login !== login && u.online === true && (!await this.isBlocked(login, u.login))) {
		//		const {username, avatar, login: ulogin, banner} = await this.getUser(u.login)
		//		const friend = await this.isFriend(login, u.login)
		//		users = [...users, {info: {login: ulogin, username, avatar, banner, stats }, friend}]
		//	}
		//}
		//return (users);
	}
}
