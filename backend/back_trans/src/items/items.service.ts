import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {equipped, inventory} from "./inventory.interface";
import {UserService} from "../user/user.service";
import {ItemsInterface} from "./items.interface";
import {TmpDbService} from "../tmp_db/tmp_db.service";

@Injectable()
export class ItemsService {
	constructor(private userService: UserService,
				private tmp_db: TmpDbService) {}

	getItemByRarity(rarity: number) {
		let itemsRarity: ItemsInterface[]
		let itemToAdd: ItemsInterface
		if (rarity === 42) {
			itemToAdd = this.tmp_db.listItems.find(items => items.id === 42)
			return (itemToAdd)
		}
		else if (rarity <= 50)
			itemsRarity = this.tmp_db.listItems.filter(items => items.rarity === 1)
		else if (rarity <= 90)
			itemsRarity = this.tmp_db.listItems.filter(items => items.rarity === 2)
		else if (rarity <= 98)
			itemsRarity = this.tmp_db.listItems.filter(items => items.rarity === 3)
		else if (rarity <= 100)
			itemsRarity = this.tmp_db.listItems.filter(items => items.rarity === 4)
		const item = Math.floor(Math.random() * itemsRarity.length)
		console.log('index item : ' + item)
		itemToAdd = itemsRarity[item]
		return (itemToAdd);
	}

	dropItem(login: string) {
		this.userService.verificationUser(login);

		const rarity = Math.floor(Math.random() * 100) + 1
		console.log('rarity : ' + rarity)

		let itemToAdd: ItemsInterface = this.getItemByRarity(rarity);
		console.log(itemToAdd)

		this.addItem(login, itemToAdd.category, itemToAdd.name);
		return (itemToAdd)
	}

	initEquipement(): inventory {
		let inventory: inventory = {
			rod: [this.tmp_db.defaultRod],
			ball: [this.tmp_db.defaultBall],
			sound: [this.tmp_db.defaultSound],
		}
		return (inventory);
	}


	initEquipped(): equipped {
		return {
			rod: this.tmp_db.defaultRod,
			ball: this.tmp_db.defaultBall,
			sound: this.tmp_db.defaultSound,
		}
	}

	//getInventory -> login
	getInventory(login: string) {
		const inventory = this.tmp_db.users.find(users => users.login === login).inventory
		return {
			rod: inventory.rod,
			ball: inventory.ball,
			sound: inventory.sound,
		};
	}

	verificationCategory(category: string) {
		if (category !== 'rod' && category !== 'ball' && category !== 'sound')
			throw new HttpException('Category not found', HttpStatus.NOT_FOUND)
	}

	verificationItem(item: string) {
		if (!this.tmp_db.listItems.find(items => items.name === item))
			throw new HttpException('Item not found', HttpStatus.NOT_FOUND)
	}

	//getICategory -> login + category
 	getICategory(login: string, category: string) {
		this.userService.verificationUser(login);
		this.verificationCategory(category)

		const inventory = this.tmp_db.users.find(users => users.login === login).inventory
		if (category === 'rod')
			return inventory.rod
		if (category === 'ball')
			return inventory.ball
		if (category === 'sound')
			return inventory.sound
 	}

// 	//isItem -> login + category + item
 	isItem(login: string, category: string, item: string) {
		this.userService.verificationUser(login);
		this.verificationCategory(category)
		this.verificationItem(item)

		const inventory = this.tmp_db.users.find(users => users.login === login).inventory
		let hasItem;
		if (category === 'rod')
			hasItem = inventory.rod.find(items => items.name === item);
		else if (category === 'ball')
			hasItem = inventory.ball.find(items => items.name === item);
		else if (category === 'sound')
			hasItem = inventory.sound.find(items => items.name === item);

		if (!hasItem)
			return false;
		return true;

 	}

// 	//addItem -> login + category + item
 	addItem(login: string, category: string, item: string) {
		this.userService.verificationUser(login);
		this.verificationCategory(category)
		this.verificationItem(item)

		const inventory = this.tmp_db.users.find(users => users.login === login).inventory
		const itemToAdd = this.tmp_db.listItems.find(items => items.name === item)
		if (category === 'rod')
			inventory.rod = [...inventory.rod, itemToAdd]
		if (category === 'ball')
			inventory.ball = [...inventory.ball, itemToAdd]
		if (category === 'sound')
			inventory.sound = [...inventory.sound, itemToAdd]
 	}

// 	//deleteItem -> login + category + item
 	deleteItem(login: string, category: string, item: string) {
		this.userService.verificationUser(login);
		this.verificationCategory(category)
		if (item === 'default')
			throw new BadRequestException("Can't delete default items")
		this.verificationItem(item)
		if (!this.isItem(login, category, item))
			throw new BadRequestException("User don't have this item")

		const inventory = this.tmp_db.users.find(users => users.login === login).inventory
		if (this.isEquipped(login, category, item))
			this.unequipItem(login, category, item)
		if (category === 'rod')
			inventory.rod = [...inventory.rod.filter(i => i.name !== item)]
		if (category === 'ball')
			inventory.ball = [...inventory.ball.filter(i => i.name !== item)]
		if (category === 'sound')
			inventory.sound = [...inventory.sound.filter(i => i.name !== item)]
 	}

	//getEquipment -> login
	getEquipment(login: string) {
		this.userService.verificationUser(login);

		const equipment = this.tmp_db.users.find(users => users.login === login).equipped
		return (equipment);
	}

	//getECategory -> login + category
	getECategory(login: string, category: string) {
		this.userService.verificationUser(login);
		this.verificationCategory(category)

		const equipment = this.tmp_db.users.find(users => users.login === login).equipped
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
		this.userService.verificationUser(login);
		this.verificationCategory(category)
		if (item !== 'default')
			this.verificationItem(item)

		const equipment = this.tmp_db.users.find(users => users.login === login).equipped
		if (category === 'rod')
			return (equipment.rod.name === item)
		if (category === 'ball')
			return (equipment.ball.name === item)
		if (category === 'sound')
			return (equipment.sound.name === item)
	}

//	//equipItem -> login + category + item
	equipItem(login: string, category: string, item: string) {
		this.userService.verificationUser(login);
		this.verificationCategory(category)
		if (item !== 'default')
			this.verificationItem(item)

		const equipment = this.tmp_db.users.find(users => users.login === login).equipped
		const itemToEquip = this.tmp_db.listItems.find(items => items.name === item)

		if (!this.isItem(login, category, item))
			throw new BadRequestException("User don't have this item")

		if (category === 'rod')
			return (equipment.rod = itemToEquip)
		if (category === 'ball')
			return (equipment.ball = itemToEquip)
		if (category === 'sound')
			return (equipment.sound = itemToEquip)
	}

//	//unequipItem -> login + category  -> Change Item to default
	unequipItem(login: string, category: string, item: string) {
		this.userService.verificationUser(login);
		this.verificationCategory(category)
		if (item !== 'default')
			this.verificationItem(item)

		const equipment = this.tmp_db.users.find(users => users.login === login).equipped
		if (!this.isEquipped(login, category, item))
			throw new BadRequestException("Equipment is not equipped")
		if (category === 'rod')
			return (equipment.rod = this.tmp_db.defaultRod)
		if (category === 'ball')
			return (equipment.ball = this.tmp_db.defaultBall)
		if (category === 'sound')
			return (equipment.sound = this.tmp_db.defaultSound)
	}

}
