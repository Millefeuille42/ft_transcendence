import { Injectable } from '@nestjs/common';
import {User} from "./user.interface";
import {equipped, inventory} from "../items/inventory.interface";
import {ItemsInterface} from "../items/items.interface";

@Injectable()
export class UserService {
	defaultRod: ItemsInterface = {
		id: 0,
		rarity: 0,
		category: 'rod',
		name: 'default',
		description: 'La barre par défaut'
	}
	defaultBall: ItemsInterface = {
		id: 1,
		rarity: 0,
		category: 'ball',
		name: 'default',
		description: 'La balle par défaut'
	}
	defaultSound: ItemsInterface = {
		id: 2,
		rarity: 0,
		category: 'sound',
		name: 'default',
		description: 'Le son par défaut'
	}
	//TODO -> Supprimer les défauts + User de test

	users: User[] = [
		{
			login: 'tester',
			email: 'tester@letest.com',
			username: 'prout',
			name: 'Le Test',
			avatar: 'https://picsum.photos/200/200?random',
			banner: 'https://picsum.photos/1920/1080?random',
			online: true,
			friends: new Set(),
			inventory: {
				rod: [this.defaultRod],
				ball: [this.defaultBall],
				sound: [this.defaultSound],
			},
			equipped: {
				rod: this.defaultRod,
				ball: this.defaultBall,
				sound: this.defaultSound,
			}
		}];


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

	isOnline(login: string) {
		return (this.users.find(users => users.login === login).online)
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

	changeOnline(login: string, change: User) {
		const userToChange = this.users.find(users => users.login === login)
		userToChange.online = change.online;
		console.log(change);
	}

}
