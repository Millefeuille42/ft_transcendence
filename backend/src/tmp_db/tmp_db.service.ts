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
			description: '/rods/rod_bretagne.png',
		},
		{
			id: 4,
			rarity: 4,
			category: 'rod',
			name: 'cristaquette',
			description: '/rods/rod_cristaquette.png',
		},
		{
			id: 5,
			rarity: 1,
			category: 'rod',
			name: 'droite',
			description: '/rods/rod_droite.png',
		},
		{
			id: 6,
			rarity: 2,
			category: 'rod',
			name: 'feu',
			description: '/rods/rod_feu.png',
		},
		{
			id: 7,
			rarity: 3,
			category: 'rod',
			name: 'github',
			description: '/rods/rod_github.png',
		},
		{
			id: 8,
			rarity: 4,
			category: 'rod',
			name: 'millefeuille',
			description: '/rods/rod_millefeuille.png',
		},
		{
			id: 9,
			rarity: 4,
			category: 'rod',
			name: 'normirod',
			description: '/rods/rod_normirod.png',
		},
		{
			id: 10,
			rarity: 3,
			category: 'rod',
			name: 'raguette',
			description: '/rods/rod_raguette.png',
		},
		{
			id: 11,
			rarity: 2,
			category: 'rod',
			name: 'zevent',
			description: '/rods/rod_zevent.png',
		},
		{
			id: 12,
			rarity: 1,
			category: 'rod',
			name: 'zizou',
			description: '/rods/rod_zizou.png',
		},

		//BALLS
		{
			id: 13,
			rarity: 2,
			category: 'ball',
			name: 'bob',
			description: '/balls/ball_bob.png'
		},
		{
			id: 14,
			rarity: 1,
			category: 'ball',
			name: 'chrome',
			description: '/balls/ball_chrome.png'
		},
		{
			id: 15,
			rarity: 1,
			category: 'ball',
			name: 'discord',
			description: '/balls/ball_discord.png'
		},
		{
			id: 16,
			rarity: 2,
			category: 'ball',
			name: 'eye',
			description: '/balls/ball_eye.png'
		},
		{
			id: 17,
			rarity: 1,
			category: 'ball',
			name: 'firefox',
			description: '/balls/ball_firefox.png'
		},
		{
			id: 18,
			rarity: 1,
			category: 'ball',
			name: 'github',
			description: '/balls/ball_github.png'
		},
		{
			id: 19,
			rarity: 4,
			category: 'ball',
			name: 'mlabouri',
			description: '/balls/ball_mlabouri.png'
		},
		{
			id: 20,
			rarity: 4,
			category: 'ball',
			name: 'normiball',
			description: '/balls/ball_normiball.png'
		},
		{
			id: 21,
			rarity: 2,
			category: 'ball',
			name: 'peach',
			description: '/balls/ball_peach.png'
		},
		{
			id: 22,
			rarity: 3,
			category: 'ball',
			name: 'pikaball',
			description: '/balls/ball_pikaball.png'
		},
		{
			id: 23,
			rarity: 3,
			category: 'ball',
			name: 'rich',
			description: '/balls/ball_rich.png'
		},
		{
			id: 24,
			rarity: 4,
			category: 'ball',
			name: 'tefroiss',
			description: '/balls/ball_tefroiss.png'
		},

		//SOUNDS

		//KARANT2
		{
			id: 42,
			rarity: 0,
			category: 'rod',
			name: 'karant 2',
			description: '/rods/rod_karant2.png'
		},

		//Default
		{
			id: 0,
			rarity: 0,
			category: 'rod',
			name: 'default',
			description: '/rods/rod_default.png'
		},
		{
			id: 1,
			rarity: 0,
			category: 'ball',
			name: 'default',
			description: '/balls/ball_default.png'
		},
		{
			id: 2,
			rarity: 0,
			category: 'sound',
			name: 'default',
			description: 'Le son par défaut'
		}

	]

	defaultRod: ItemsInterface = {
		id: 0,
		rarity: 0,
		category: 'rod',
		name: 'default',
		description: '/rods/rod_default.png'
	}
	defaultBall: ItemsInterface = {
		id: 1,
		rarity: 0,
		category: 'ball',
		name: 'default',
		description: '/balls/ball_default.png'
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
			blocked: new Array<string>(),
			inventory: {
				rod: [this.defaultRod],
				ball: [this.defaultBall],
				sound: [this.defaultSound],
			},
			equipped: {
				rod: this.defaultRod,
				ball: this.defaultBall,
				sound: this.defaultSound,
			},
			stats: {
				total: 0,
				win: 0,
				loose: 0,
				points: 5,
				lastRival: 'No one :(',
			}
		}];
}

