import { Injectable } from '@nestjs/common';
import {User} from "../user/user.interface";
import {ItemsInterface} from "../items/items.interface";

@Injectable()
export class TmpDbService {
	listItems: ItemsInterface[] = [
		//RODS
		{
			id: 3,
			rarity: 4,
			category: 'rod',
			name: 'bretagne',
			description: '../assets/rods/rod_bretagne.png',
		},
		{
			id: 4,
			rarity: 4,
			category: 'rod',
			name: 'cristaquette',
			description: '../assets/rods/rod_cristaquette.png',
		},
		{
			id: 5,
			rarity: 1,
			category: 'rod',
			name: 'droite',
			description: '../assets/rods/rod_droite.png',
		},
		{
			id: 6,
			rarity: 2,
			category: 'rod',
			name: 'feu',
			description: '../assets/rods/rod_feu.png',
		},
		{
			id: 7,
			rarity: 3,
			category: 'rod',
			name: 'github',
			description: '../assets/rods/rod_github.png',
		},
		{
			id: 8,
			rarity: 4,
			category: 'rod',
			name: 'millefeuille',
			description: '../assets/rods/rod_millefeuille.png',
		},
		{
			id: 9,
			rarity: 4,
			category: 'rod',
			name: 'normirod',
			description: '../assets/rods/rod_normirod.png',
		},
		{
			id: 10,
			rarity: 3,
			category: 'rod',
			name: 'raguette',
			description: '../assets/rods/rod_raguette.png',
		},
		{
			id: 11,
			rarity: 2,
			category: 'rod',
			name: 'zevent',
			description: '../assets/rods/rod_zevent.png',
		},
		{
			id: 12,
			rarity: 3,
			category: 'rod',
			name: 'zizi',
			description: '../assets/rods/rod_zizi.png',
		},
		{
			id: 13,
			rarity: 1,
			category: 'rod',
			name: 'zizou',
			description: '../assets/rods/rod_zizou.png',
		},

		//BALLS
		{
			id: 14,
			rarity: 2,
			category: 'ball',
			name: 'bob',
			description: '../assets/balls/ball_bob.png'
		},
		{
			id: 15,
			rarity: 1,
			category: 'ball',
			name: 'chrome',
			description: '../assets/balls/ball_chrome.png'
		},
		{
			id: 16,
			rarity: 1,
			category: 'ball',
			name: 'discord',
			description: '../assets/balls/ball_discord.png'
		},
		{
			id: 17,
			rarity: 2,
			category: 'ball',
			name: 'eye',
			description: '../assets/balls/ball_eye.png'
		},
		{
			id: 18,
			rarity: 1,
			category: 'ball',
			name: 'firefox',
			description: '../assets/balls/ball_firefox.png'
		},
		{
			id: 18,
			rarity: 1,
			category: 'ball',
			name: 'github',
			description: '../assets/balls/ball_github.png'
		},
		{
			id: 20,
			rarity: 4,
			category: 'ball',
			name: 'mlabouri',
			description: '../assets/balls/ball_mlabouri.png'
		},
		{
			id: 21,
			rarity: 4,
			category: 'ball',
			name: 'normiball',
			description: '../assets/balls/ball_normiball.png'
		},
		{
			id: 22,
			rarity: 2,
			category: 'ball',
			name: 'peach',
			description: '../assets/balls/ball_peach.png'
		},
		{
			id: 23,
			rarity: 3,
			category: 'ball',
			name: 'pikaball',
			description: '../assets/balls/ball_pikaball.png'
		},
		{
			id: 24,
			rarity: 3,
			category: 'ball',
			name: 'rich',
			description: '../assets/balls/ball_rich.png'
		},
		{
			id: 25,
			rarity: 4,
			category: 'ball',
			name: 'tefroiss',
			description: '../assets/balls/ball_tefroiss.png'
		},

		//SOUNDS

		//KARANT2
		{
			id: 42,
			rarity: 0,
			category: 'rod',
			name: 'karant 2',
			description: '../assets/rods/rod_karant2.png'
		}
	]

	defaultRod: ItemsInterface = {
		id: 0,
		rarity: 0,
		category: 'rod',
		name: 'default',
		description: '../assets/rods/rod_default.png'
	}
	defaultBall: ItemsInterface = {
		id: 1,
		rarity: 0,
		category: 'ball',
		name: 'default',
		description: '../assets/balls/ball_default.png'
	}
	defaultSound: ItemsInterface = {
		id: 2,
		rarity: 0,
		category: 'sound',
		name: 'default',
		description: 'Le son par défaut'
	}

	users: User[] = [
		{
			login: 'tester',
			email: 'tester@letest.com',
			username: 'prout',
			name: 'Le Test',
			avatar: 'https://picsum.photos/200/200?random',
			banner: 'https://picsum.photos/1920/1080?random',
			online: true,
			friends: new Array<string>(),
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
}

