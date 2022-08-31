import {BadRequestException, ConflictException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {User} from "./user.interface";
import {TmpDbService} from "../tmp_db/tmp_db.service";
import {CreateUserDto} from "./create-user.dto";

@Injectable()
export class UserService {
	constructor(private tmp_db: TmpDbService) {}

	connectSession = new Map<string, string>([]);

	verificationUser(login: string) {
		if (!(this.tmp_db.users.find(user => user.login === login)))
			throw new HttpException('User not found', HttpStatus.NOT_FOUND)
	}

	getUser(login: string) {
		this.verificationUser(login)
		return this.tmp_db.users.find(users => users.login === login);
	}

	getName(login: string) {
		this.verificationUser(login)
		return {
			name: this.tmp_db.users.find(users => users.login === login).name,
		}
	}

	getAvatar(login: string) {
		this.verificationUser(login)
		return {
			avatar: this.tmp_db.users.find(users => users.login === login).avatar,
		}
	}

	getMail(login: string) {
		this.verificationUser(login)
		return {
			email: this.tmp_db.users.find(users => users.login === login).email,
		}
	}

	getBanner(login: string) {
		this.verificationUser(login)
		return {
			banner: this.tmp_db.users.find(users => users.login === login).banner,
		}
	}

	getUsername(login: string) {
		this.verificationUser(login)
		return {
			username: this.tmp_db.users.find(users => users.login === login).username,
		}
	}

	isOnline(login: string) {
		this.verificationUser(login)
		return (this.tmp_db.users.find(users => users.login === login).online)
	}


	getToken(login: string) {
		return this.connectSession.get(login);
	}

	deleteToken(login: string) {
		this.connectSession.delete(login);
	}

	changeAvatar(login: string, change: User) {
		this.verificationUser(login)
		const userToChange = this.tmp_db.users.find(users => users.login === login);
		userToChange.avatar = change.avatar;
	//	console.log(change.avatar)
		console.log(change)
	}

	changeBanner(login: string, change: User) {
		this.verificationUser(login)
		const userToChange = this.tmp_db.users.find(users => users.login === login);
		userToChange.banner = change.banner;
	//	console.log(change.banner)
		console.log(change)
	}


	changeUsername(login: string, change: User) {
		this.verificationUser(login)
		if (change.username.length > 12)
			throw new BadRequestException()
		const loginOtherUser = this.isUsernameExist(change.username)
		if (loginOtherUser.userExist) {
			if (change.username === login) {
				let otherUser = this.tmp_db.users.find(user => user.login === loginOtherUser.login)
				const newChange: CreateUserDto = {username : otherUser.login}
				this.changeUsername(otherUser.login, newChange)
			}
			else
				throw new ConflictException()
		}
		const userToChange = this.tmp_db.users.find(users => users.login === login);
		userToChange.username = change.username;
		console.log(change)
	}

	changeOnline(login: string, change: User) {
		this.verificationUser(login)
		const userToChange = this.tmp_db.users.find(users => users.login === login)
		userToChange.online = change.online;
		console.log(change);
	}

	isUsernameExist(username: string): {userExist: boolean, login?: string} {
		const user = this.tmp_db.users.find(users => users.username === username)
		if (!user)
			return {userExist: false}
		return {
			userExist: true,
			login: user.login
		}
	}

}
