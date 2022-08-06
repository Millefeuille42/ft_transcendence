import { Injectable } from '@nestjs/common';
import {equipped, inventory} from "./inventory.interface";
import {UserService} from "../user/user.service";

@Injectable()
export class ItemsService {
	constructor(private userService: UserService) {}

	initEquipement(): inventory {
		let inventory: inventory = {
			rod: new Set(),
			ball: new Set(),
			sound: new Set(),
		}
		inventory.rod.add('default')
		inventory.sound.add('default')
		inventory.ball.add('default')
		return (inventory);
	}


	initEquipped(): equipped {
		return {
			rod: 'default',
			ball: 'default',
			sound: 'default',
		}
	}

	//getInventory -> login
	getInventory(login: string) {
		const inventory = this.userService.users.find(users => users.login === login).inventory
		return {
			rod: Array.from(inventory.rod),
			ball: Array.from(inventory.ball),
			sound: Array.from(inventory.sound)
		};
	}

	//getICategory -> login + category
 	getICategory(login: string, category: string) {
		const inventory = this.userService.users.find(users => users.login === login).inventory
		if (category === 'rod')
			return {rod: Array.from(inventory.rod)}
		if (category === 'ball')
			return {ball: Array.from(inventory.ball)}
		if (category === 'sound')
			return {sound: Array.from(inventory.sound)}
 	}

// 	//isItem -> login + category + item
 	isItem(login: string, category: string, item: string) {
		const inventory = this.userService.users.find(users => users.login === login).inventory
		if (category === 'rod')
			return inventory.rod.has(item);
		if (category === 'ball')
			return inventory.ball.has(item);
		if (category === 'sound')
			return inventory.sound.has(item);

 	}

// 	//addItem -> login + category + item
 	addItem(login: string, category: string, item: string) {
		const inventory = this.userService.users.find(users => users.login === login).inventory
		if (category === 'rod')
			return inventory.rod.add(item);
		if (category === 'ball')
			return inventory.ball.add(item);
		if (category === 'sound')
			return inventory.sound.add(item);
 	}

// 	//deleteItem -> login + category + item
 	deleteItem(login: string, category: string, item: string) {
		const inventory = this.userService.users.find(users => users.login === login).inventory
		if (category === 'rod') {
			if (this.isEquipped(login, category, item))
				this.unequipItem(login, category, item)
			return inventory.rod.delete(item);
		}
		if (category === 'ball') {
			if (this.isEquipped(login, category, item))
				this.unequipItem(login, category, item)
			return inventory.ball.delete(item);
		}
		if (category === 'sound') {
			if (this.isEquipped(login, category, item))
				this.unequipItem(login, category, item)
			return inventory.sound.delete(item);
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
			return { rod: equipment.rod }
		if (category === 'ball')
			return { ball: equipment.ball }
		if (category === 'sound')
			return { sound: equipment.sound }
	}
//
//	//isEquipped -> login + category + item
	isEquipped(login: string, category: string, item: string) {
		const equipment = this.userService.users.find(users => users.login === login).equipped
		if (category === 'rod')
			return (equipment.rod === item)
		if (category === 'ball')
			return (equipment.ball === item)
		if (category === 'sound')
			return (equipment.sound === item)
	}

//	//equipItem -> login + category + item
	equipItem(login: string, category: string, item: string) {
		const equipment = this.userService.users.find(users => users.login === login).equipped
		if (category === 'rod') {
			if (this.isItem(login, category, item))
				return (equipment.rod = item)
		}
		if (category === 'ball') {
			if (this.isItem(login, category, item))
				return (equipment.ball = item)
		}
		if (category === 'sound') {
			if (this.isItem(login, category, item))
				return (equipment.sound = item)
		}
	}

//	//unequipItem -> login + category  -> Change Item to default
	unequipItem(login: string, category: string, item: string) {
		const equipment = this.userService.users.find(users => users.login === login).equipped
		if (category === 'rod') {
			if (this.isEquipped(login, category, item))
				return (equipment.rod = 'default')
		}
		if (category === 'ball') {
			if (this.isEquipped(login, category, item))
				return (equipment.ball = 'default')
		}
		if (category === 'sound') {
			if (this.isEquipped(login, category, item))
				return (equipment.sound = 'default')
		}
	}

}
