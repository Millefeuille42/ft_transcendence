import { Injectable } from '@nestjs/common';
import {User} from "./user.interface";
import {TmpDbService} from "../tmp_db/tmp_db.service";

@Injectable()
export class UserService {
	constructor(private tmp_db: TmpDbService) {
	}
	connectSession = new Map<string, string>([]);

	getUser(login: string) {
		return this.tmp_db.users.find(users => users.login === login);
	}

	getName(login: string) {
		return {
			name: this.tmp_db.users.find(users => users.login === login).name,
		}
	}

	getAvatar(login: string) {
		return {
			avatar: this.tmp_db.users.find(users => users.login === login).avatar,
		}
	}

	getMail(login: string) {
		return {
			email: this.tmp_db.users.find(users => users.login === login).email,
		}
	}

	getBanner(login: string) {
		return {
			banner: this.tmp_db.users.find(users => users.login === login).banner,
		}
	}

	getUsername(login: string) {
		return {
			username: this.tmp_db.users.find(users => users.login === login).username,
		}
	}

	isOnline(login: string) {
		return (this.tmp_db.users.find(users => users.login === login).online)
	}


	getToken(login: string) {
		return this.connectSession.get(login);
	}

	deleteToken(login: string) {
		this.connectSession.delete(login);
	}

	changeAvatar(login: string, change: User) {
		const userToChange = this.tmp_db.users.find(users => users.login === login);
		userToChange.avatar = change.avatar;
	//	console.log(change.avatar)
		console.log(change)
	}

	changeBanner(login: string, change: User) {
		const userToChange = this.tmp_db.users.find(users => users.login === login);
		userToChange.banner = change.banner;
	//	console.log(change.banner)
		console.log(change)
	}


	changeUsername(login: string, change: User) {
		if (change.username.length > 12) {
			console.log(change.username, 'is more than 12 characters')
			return ;
		}
		const userToChange = this.tmp_db.users.find(users => users.login === login);
		userToChange.username = change.username;
		console.log(change)
	}

	changeOnline(login: string, change: User) {
		const userToChange = this.tmp_db.users.find(users => users.login === login)
		userToChange.online = change.online;
		console.log(change);
	}

}
