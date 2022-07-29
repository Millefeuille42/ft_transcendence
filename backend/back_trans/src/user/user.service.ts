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

	getCode(login: string) {
		return {
			code: this.users.find(users => users.login === login).code,
		}
	}

	getToken(login: string) {
		return this.connectSession.get(login);
	}

	deleteToken(login: string) {
		this.connectSession.delete(login);
	}
}
