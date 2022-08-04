import { Injectable } from '@nestjs/common';
import {User} from "./user.interface";

@Injectable()
export class UserService {
	users: User[] = [];
	connectSession = new Map<string, string>([]);

	getUser(login: string) {
		return this.users.find(users => users.login === login);
	}

	getName(login: string) {
		return {
			name: this.users.find(users => users.login === login).name,
		}
	}

	getAvatar(login: string) {
		return {
			avatar: this.users.find(users => users.login === login).avatar,
		}
	}

	getMail(login: string) {
		return {
			email: this.users.find(users => users.login === login).email,
		}
	}

	getBanner(login: string) {
		return {
			banner: this.users.find(users => users.login === login).banner,
		}
	}

	getUsername(login: string) {
		return {
			username: this.users.find(users => users.login === login).username,
		}
	}

	getToken(login: string) {
		return this.connectSession.get(login);
	}

	deleteToken(login: string) {
		this.connectSession.delete(login);
	}

	changeAvatar(login: string, change: User) {
		const userToChange = this.users.find(users => users.login === login);
		userToChange.avatar = change.avatar;
	//	console.log(change.avatar)
		console.log(change)
	}

	changeBanner(login: string, change: User) {
		const userToChange = this.users.find(users => users.login === login);
		userToChange.banner = change.banner;
	//	console.log(change.banner)
		console.log(change)
	}


	changeUsername(login: string, change: User) {
		if (change.username.length > 12) {
			console.log(change.username, 'is more than 12 characters')
			return ;
		}
		const userToChange = this.users.find(users => users.login === login);
		userToChange.username = change.username;
	//	console.log(change.username)
		console.log(change)
	}
}
