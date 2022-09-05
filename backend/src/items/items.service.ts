import {BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {EInventory, equipped, inventory} from "./inventory.interface";
import {UserService} from "../user/user.service";
import {EItems, ItemsInterface} from "./items.interface";
import {TmpDbService} from "../tmp_db/tmp_db.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Items} from "./items.entity";

@Injectable()
export class ItemsService {
	constructor(@Inject(forwardRef(() => UserService))
				private userService: UserService,
				private tmp_db: TmpDbService,
				@InjectRepository(Items) private listItems: Repository<Items> ) {}

	async getAll(): Promise<Items[]> {
		return await this.listItems.find()
	}

	async createOneItem(item: Items) {
		await this.listItems.save(item)
		let num: number = item.id
		return await this.listItems.findOneBy({id: num})
	}

	async removeItem(id: number) {
		return await this.listItems.delete(id)
	}

	async getItemByRarity(rarity: number) {

		let itemsRarity: ItemsInterface[]
		let itemToAdd: ItemsInterface
		if (rarity === 42) {
			itemToAdd = await this.listItems.findOneBy({category: 'rod', rarity: 42})
			//itemToAdd = this.tmp_db.listItems.find(items => items.id === 42)
			return (itemToAdd)
		}
		else if (rarity <= 50)
			itemsRarity = await this.listItems.find({where: {rarity: 1}})
		else if (rarity <= 90)
			itemsRarity = await this.listItems.find({where: {rarity: 2}})
		else if (rarity <= 98)
			itemsRarity = await this.listItems.find({where: {rarity: 3}})
		else if (rarity <= 100)
			itemsRarity = await this.listItems.find({where: {rarity: 4}})
		const item = Math.floor(Math.random() * itemsRarity.length)
		console.log('index item : ' + item)
		itemToAdd = itemsRarity[item]
		return (itemToAdd);
	}

	async dropItem(login: string) {
		const user = await this.userService.getUser(login)
		if (user.stats.points <= 0)
			throw new HttpException('User have not enough points', HttpStatus.FORBIDDEN)
		user.stats.points--

		const rarity = Math.floor(Math.random() * 100) + 1
		console.log('rarity : ' + rarity)

		let itemToAdd: ItemsInterface = await this.getItemByRarity(rarity);
		console.log(itemToAdd)

		await this.addItem(login, itemToAdd.category, itemToAdd.name);
		return (itemToAdd)
	}

	async initEquipement(login: string) {
		let defRod: EItems = {
			rarity: 0,
			category: 'rod',
			name: 'default',
			description: 'lol'
		} as EItems
		let defBall: EItems = {
			rarity: 0,
			category: 'ball',
			name: 'default',
			description: 'lol'
		} as EItems
		let defSound: EItems = {
			rarity: 0,
			category: 'sound',
			name: 'default',
			description: 'lol'
		} as EItems
		let inventory: EInventory = {
			login: login,
			rod: [] as EItems[],
			ball: [] as EItems[],
			sound: [] as EItems[],
		} as EInventory
		inventory.rod.push(defRod)
		inventory.ball.push(defBall)
		inventory.sound.push(defSound)
		return (inventory);
	}


	async initEquipped(login: string) {
		return {
			login: login,
			rod: this.tmp_db.defaultRod,
			ball: this.tmp_db.defaultBall,
			sound: this.tmp_db.defaultSound,
		}
	}

	//getInventory -> login
	async getInventory(login: string) {
		const user = await this.userService.getUser(login)
		const inventory = user.inventory
		return {
			rod: inventory.rod,
			ball: inventory.ball,
			sound: inventory.sound,
		};
	}

	async verificationCategory(category: string) {
		if (category !== 'rod' && category !== 'ball' && category !== 'sound')
			throw new HttpException('Category not found', HttpStatus.NOT_FOUND)
	}

	async verificationItemInCategory(category: string, item: string) {
		if (!await this.listItems.findOneBy({category: category, name: item}))
			throw new HttpException('Item not found', HttpStatus.NOT_FOUND)

		//if (!this.tmp_db.listItems.filter(items => items.category === category).
		//find(items => items.name === item))
		//	throw new HttpException('Item not found', HttpStatus.NOT_FOUND)
	}

	//getICategory -> login + category
 	async getICategory(login: string, category: string) {
		const user = await this.userService.getUser(login)
		await this.verificationCategory(category)

		const inventory = user.inventory
		if (category === 'rod')
			return inventory.rod
		if (category === 'ball')
			return inventory.ball
		if (category === 'sound')
			return inventory.sound
 	}

// 	//isItem -> login + category + item
 	async isItem(login: string, category: string, item: string) {
		const user = await this.userService.getUser(login)
		await this.verificationCategory(category)
		await this.verificationItemInCategory(category, item)

		const inventory = user.inventory
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
 	async addItem(login: string, category: string, item: string) {
		const user = await this.userService.getUser(login)
		await this.verificationCategory(category)
		//await this.verificationItemInCategory(category, item)

		const inventory = user.inventory
		const itemToAdd = await this.listItems.findOneBy({category: category, name: item})
		//const itemToAdd = this.tmp_db.listItems.filter(items => items.category === category).find(items => items.name === item)
		if (category === 'rod')
			inventory.rod = [...inventory.rod, itemToAdd]
		if (category === 'ball')
			inventory.ball = [...inventory.ball, itemToAdd]
		if (category === 'sound')
			inventory.sound = [...inventory.sound, itemToAdd]
 	}

// 	//deleteItem -> login + category + item
 	async deleteItem(login: string, category: string, item: string) {
		const user = await this.userService.getUser(login)
		await this.verificationCategory(category)
		if (item === 'default')
			throw new BadRequestException("Can't delete default items")
		await this.verificationItemInCategory(category, item)
		if (!(await this.isItem(login, category, item)))
			throw new BadRequestException("User don't have this item")

		const inventory = user.inventory
		if (await this.isEquipped(login, category, item))
			await this.unequipItem(login, category, item)
		if (category === 'rod')
			inventory.rod = [...inventory.rod.filter(i => i.name !== item)]
		if (category === 'ball')
			inventory.ball = [...inventory.ball.filter(i => i.name !== item)]
		if (category === 'sound')
			inventory.sound = [...inventory.sound.filter(i => i.name !== item)]
 	}

	//getEquipment -> login
	async getEquipment(login: string) {
		const user = await this.userService.getUser(login)

		const equipment = user.equipped
		return (equipment);
	}

	//getECategory -> login + category
	async getECategory(login: string, category: string) {
		const user = await this.userService.getUser(login)
		await this.verificationCategory(category)

		const equipment = user.equipped
		if (category === 'rod')
			return equipment.rod
		if (category === 'ball')
			return equipment.ball
		if (category === 'sound')
			return equipment.sound
	}
//
//	//isEquipped -> login + category + item
	async isEquipped(login: string, category: string, item: string) {
		const user = await this.userService.getUser(login)
		await this.verificationCategory(category)
		if (item !== 'default')
			await this.verificationItemInCategory(category, item)

		const equipment = user.equipped
		if (category === 'rod')
			return (equipment.rod.name === item)
		if (category === 'ball')
			return (equipment.ball.name === item)
		if (category === 'sound')
			return (equipment.sound.name === item)
	}

//	//equipItem -> login + category + item
	async equipItem(login: string, category: string, item: string) {
		const user = await this.userService.getUser(login)
		await this.verificationCategory(category)
		if (item !== 'default')
			await this.verificationItemInCategory(category, item)

		const equipment = user.equipped
		const itemToEquip = this.tmp_db.listItems.find(items => items.name === item)

		if (!(await this.isItem(login, category, item)))
			throw new BadRequestException("User don't have this item")

		if (category === 'rod')
			return (equipment.rod = itemToEquip)
		if (category === 'ball')
			return (equipment.ball = itemToEquip)
		if (category === 'sound')
			return (equipment.sound = itemToEquip)
	}

//	//unequipItem -> login + category  -> Change Item to default
	async unequipItem(login: string, category: string, item: string) {
		const user = await this.userService.getUser(login)
		await this.verificationCategory(category)
		if (item !== 'default')
			await this.verificationItemInCategory(category, item)

		const equipment = user.equipped
		if (!(await this.isEquipped(login, category, item)))
			throw new BadRequestException("Equipment is not equipped")
		if (category === 'rod')
			return (equipment.rod = this.tmp_db.defaultRod)
		if (category === 'ball')
			return (equipment.ball = this.tmp_db.defaultBall)
		if (category === 'sound')
			return (equipment.sound = this.tmp_db.defaultSound)
	}
}
