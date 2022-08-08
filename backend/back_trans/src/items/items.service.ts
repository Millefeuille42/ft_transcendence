import { Injectable } from '@nestjs/common';
import {equipped, inventory} from "./inventory.interface";
import {UserService} from "../user/user.service";
import {ItemsInterface} from "./items.interface";

@Injectable()
export class ItemsService {
	constructor(private userService: UserService) {}

	listItems: ItemsInterface[] = [
		{
			id: 3,
			rarity: 2,
			category: 'rod',
			name: 'patate',
			description: 'une jolie patate',
		},
		{
			id: 4,
			rarity: 1,
			category: 'rod',
			name: 'pomme',
			description: 'une jolie pomme',
		},
		{
			id: 5,
			rarity: 3,
			category: 'ball',
			name: 'cookie',
			description: 'un jolie cookie',
		},
		{
			id: 6,
			rarity: 2,
			category: 'sound',
			name: 'poire',
			description: 'une jolie poire',
		},
		{
			id: 7,
			rarity: 4,
			category: 'rod',
			name: 'LA LÉGENDE',
			description: 'une jolie LÉGENDE',
		},
		{
			id: 42,
			rarity: 0,
			category: 'rod',
			name: 'karant 2',
			description: 'le lien vers la rod lol'
		}
	]
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

	dropItem(login: string) {
		const rarity = Math.floor(Math.random() * 100) + 1
		console.log('rarity : ' + rarity)
		let itemsRarity: ItemsInterface[]
		let itemToAdd: ItemsInterface
		if (rarity === 42) {
			itemToAdd = this.listItems.find(items => items.id === 42)
			console.log (itemToAdd)
			this.addItem(login, itemToAdd.category, itemToAdd.name)
			return (itemToAdd)
		}
		else if (rarity <= 50)
			itemsRarity = this.listItems.filter(items => items.rarity === 1)
		else if (rarity <= 90)
			itemsRarity = this.listItems.filter(items => items.rarity === 2)
		else if (rarity <= 98)
			itemsRarity = this.listItems.filter(items => items.rarity === 3)
		else if (rarity <= 100)
			itemsRarity = this.listItems.filter(items => items.rarity === 4)
		const item = Math.floor(Math.random() * itemsRarity.length)
		console.log('index item : ' + item)
		itemToAdd = itemsRarity[item]
		console.log(itemToAdd)
		this.addItem(login, itemToAdd.category, itemToAdd.name);
		return (itemToAdd)
	}

	initEquipement(): inventory {
		let inventory: inventory = {
			rod: [this.defaultRod],
			ball: [this.defaultBall],
			sound: [this.defaultSound],
		}
		return (inventory);
	}


	initEquipped(): equipped {
		return {
			rod: this.defaultRod,
			ball: this.defaultBall,
			sound: this.defaultSound,
		}
	}

	//getInventory -> login
	getInventory(login: string) {
		const inventory = this.userService.users.find(users => users.login === login).inventory
		return {
			rod: inventory.rod,
			ball: inventory.ball,
			sound: inventory.sound,
		};
	}

	//getICategory -> login + category
 	getICategory(login: string, category: string) {
		const inventory = this.userService.users.find(users => users.login === login).inventory
		if (category === 'rod')
			return inventory.rod
		if (category === 'ball')
			return inventory.ball
		if (category === 'sound')
			return inventory.sound
 	}

// 	//isItem -> login + category + item
 	isItem(login: string, category: string, item: string) {
		const inventory = this.userService.users.find(users => users.login === login).inventory
		if (category === 'rod') {
				const hasItem = inventory.rod.find(items => items.name === item);
				if (!hasItem)
					return false;
				return true;
			}
		if (category === 'ball'){
			const hasItem = inventory.ball.find(items => items.name === item);
			if (!hasItem)
				return false;
			return true;
		}
		if (category === 'sound'){
			const hasItem = inventory.sound.find(items => items.name === item);
			if (!hasItem)
				return false;
			return true;
		}

 	}

// 	//addItem -> login + category + item
 	addItem(login: string, category: string, item: string) {
		const inventory = this.userService.users.find(users => users.login === login).inventory
		const itemToAdd = this.listItems.find(items => items.name === item)
		if (category === 'rod')
			inventory.rod = [...inventory.rod, itemToAdd]
		if (category === 'ball')
			inventory.ball = [...inventory.ball, itemToAdd]
		if (category === 'sound')
			inventory.sound = [...inventory.sound, itemToAdd]
 	}

// 	//deleteItem -> login + category + item
 	deleteItem(login: string, category: string, item: string) {
		const inventory = this.userService.users.find(users => users.login === login).inventory
		if (category === 'rod') {
			if (this.isEquipped(login, category, item))
				this.unequipItem(login, category, item)
			inventory.rod = [...inventory.rod.filter(i => i.name !== item)]
		}
		if (category === 'ball') {
			if (this.isEquipped(login, category, item))
				this.unequipItem(login, category, item)
			inventory.ball = [...inventory.ball.filter(i => i.name !== item)]
		}
		if (category === 'sound') {
			if (this.isEquipped(login, category, item))
				this.unequipItem(login, category, item)
			inventory.sound = [...inventory.sound.filter(i => i.name !== item)]
		}
 	}

	//getEquipment -> login
	getEquipment(login: string) {
		const equipment = this.userService.users.find(users => users.login === login).equipped
		return (equipment);
	}

	//getECategory -> login + category
	getECategory(login: string, category: string) {
		const equipment = this.userService.users.find(users => users.login === login).equipped
		if (category === 'rod')
			return equipment.rod
		if (category === 'ball')
			return equipment.ball
		if (category === 'sound')
			return equipment.sound
	}
//
//	//isEquipped -> login + category + item
	isEquipped(login: string, category: string, item: string) {
		const equipment = this.userService.users.find(users => users.login === login).equipped
		if (category === 'rod')
			return (equipment.rod.name === item)
		if (category === 'ball')
			return (equipment.ball.name === item)
		if (category === 'sound')
			return (equipment.sound.name === item)
	}

//	//equipItem -> login + category + item
	equipItem(login: string, category: string, item: string) {
		const equipment = this.userService.users.find(users => users.login === login).equipped
		const itemToEquip = this.listItems.find(items => items.name === item)
		if (category === 'rod') {
			if (this.isItem(login, category, item))
				return (equipment.rod = itemToEquip)
		}
		if (category === 'ball') {
			if (this.isItem(login, category, item))
				return (equipment.ball = itemToEquip)
		}
		if (category === 'sound') {
			if (this.isItem(login, category, item))
				return (equipment.sound = itemToEquip)
		}
	}

//	//unequipItem -> login + category  -> Change Item to default
	unequipItem(login: string, category: string, item: string) {
		const equipment = this.userService.users.find(users => users.login === login).equipped
		if (category === 'rod') {
			if (this.isEquipped(login, category, item))
				return (equipment.rod = this.defaultRod)
		}
		if (category === 'ball') {
			if (this.isEquipped(login, category, item))
				return (equipment.ball = this.defaultBall)
		}
		if (category === 'sound') {
			if (this.isEquipped(login, category, item))
				return (equipment.sound = this.defaultSound)
		}
	}

}
