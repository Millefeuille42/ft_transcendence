import { Injectable } from '@nestjs/common';
import {User} from "../auth/auth.interface";

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

	getToken(login: string) {
		return this.connectSession.get(login);
	}

	deleteToken(login: string) {
		this.connectSession.delete(login);
	}

	changeAvatar(login: string, avatar: string) {
		this.users.find(users => users.login === login).avatar = avatar;
	}

	changeBanner(login: string, banner: string) {
		this.users.find(users => users.login === login).banner = banner;
	}
}
