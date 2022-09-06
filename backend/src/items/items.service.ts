import {BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {EInventory, equipped, inventory} from "./inventory.interface";
import {UserService} from "../user/user.service";
import {EItems, ItemsInterface} from "./items.interface";
import {TmpDbService} from "../tmp_db/tmp_db.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Items} from "../entities/items.entity";
import {EquipmentEntity, InventoryEntity} from "../entities/inventory.entity";

@Injectable()
export class ItemsService {
	constructor(@Inject(forwardRef(() => UserService))
				private userService: UserService,
				private tmp_db: TmpDbService,
				@InjectRepository(Items) private listItems: Repository<Items>,
				@InjectRepository(InventoryEntity) private inventoryRepository: Repository<InventoryEntity>,
				@InjectRepository(EquipmentEntity) private equipmentRepository: Repository<EquipmentEntity>) {}

	async getAll(): Promise<Items[]> {
		return await this.listItems.find()
	}

	async getItemByNameAndCategory(name: string, category: string) {
		return await this.listItems.findOneBy({name: name, category: category})
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

		let itemsRarity: Items[]
		let itemToAdd: Items
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
//		if (user.stats.points <= 0)
//			throw new HttpException('User have not enough points', HttpStatus.FORBIDDEN)
//		user.stats.points--

		const rarity = Math.floor(Math.random() * 100) + 1
		console.log('rarity : ' + rarity)

		let itemToAdd: Items = await this.getItemByRarity(rarity);
		console.log(itemToAdd)

		await this.addItem(login, itemToAdd);
		return (itemToAdd)
	}

	async initInventory(login: string) {
		const user = await this.userService.getUser(login)
		const inventory = {
			id: user.id,
			rod: [(await this.listItems.findOneBy({name: 'default', category: 'rod'})).id],
			ball: [(await this.listItems.findOneBy({name: 'default', category: 'ball'})).id],
			sound: [(await this.listItems.findOneBy({name: 'default', category: 'sound'})).id],
		}
		await this.inventoryRepository.save(inventory)
	}


	async initEquipment(login: string) {
		const user = await this.userService.getUser(login)

		const equipment = {
			id: user.id,
			rod: (await this.listItems.findOneBy({name: 'default', category: 'rod'})).id,
			ball: (await this.listItems.findOneBy({name: 'default', category: 'ball'})).id,
			sound: (await this.listItems.findOneBy({name: 'default', category: 'sound'})).id
		}
		await this.equipmentRepository.save(equipment)
	}

	//getInventory -> login
	async getInventory(login: string) {
		const user = await this.userService.getUser(login)
		const inventory = await this.inventoryRepository.findOneBy({id: user.id})
		console.log(inventory)
		let rod: Items[] = []
		let ball: Items[] = []
		let sound: Items[] = []
		await Promise.all(inventory.rod.map(async (id) => {
			rod.push(await this.listItems.findOneBy({id: id}))
		}))
		await Promise.all(inventory.ball.map(async (id) => {
			ball.push(await this.listItems.findOneBy({id: id}))
		}))
		await Promise.all(inventory.sound.map(async (id) => {
			sound.push(await this.listItems.findOneBy({id: id}))
		}))
		return {
			rod: rod,
			ball: ball,
			sound: sound,
		};
	}

	async verificationCategory(category: string) {
		if (category !== 'rod' && category !== 'ball' && category !== 'sound')
			throw new HttpException('Category not found', HttpStatus.NOT_FOUND)
	}

	async verificationItemInCategory(category: string, item: string) {
		if (!await this.listItems.findOneBy({category: category, name: item}))
			throw new HttpException('Item not found', HttpStatus.NOT_FOUND)
	}

	//getICategory -> login + category
 	async getICategory(login: string, category: string) {
		const user = await this.userService.getUser(login)
		await this.verificationCategory(category)

		let retCategory: Items[] = []
		const inventory = await this.inventoryRepository.findOneBy({id: user.id})
		if (category === 'rod') {
			await Promise.all(inventory.rod.map(async (id) => {
				retCategory.push(await this.listItems.findOneBy({id: id}))
			}))
		}
		if (category === 'ball') {
			await Promise.all(inventory.ball.map(async (id) => {
				retCategory.push(await this.listItems.findOneBy({id: id}))
			}))
		}
		if (category === 'sound') {
			await Promise.all(inventory.sound.map(async (id) => {
				retCategory.push(await this.listItems.findOneBy({id: id}))
			}))
		}
		return retCategory
 	}

// 	//isItem -> login + category + item
 	async isItem(login: string, category: string, item: string) {
		const user = await this.userService.getUser(login)
		await this.verificationCategory(category)
		await this.verificationItemInCategory(category, item)

		let inventory: number[]
		if (category === 'rod')
			inventory = (await this.inventoryRepository.findOneBy({id: user.id})).rod
		if (category === 'ball')
			inventory = (await this.inventoryRepository.findOneBy({id: user.id})).ball
		if (category === 'sound')
			inventory = (await this.inventoryRepository.findOneBy({id: user.id})).sound
		const itemToSearch = await this.listItems.findOneBy({name: item, category: category})
		if (inventory.find(i => i === itemToSearch.id))
			return true;
		return false;

 	}

// 	//addItem -> login + category + item
 	async addItem(login: string, item: Items) {
		const user = await this.userService.getUser(login)
		await this.verificationCategory(item.category)
		await this.verificationItemInCategory(item.category, item.name)

		const inventory = await this.inventoryRepository.findOneBy({id: user.id})
		if (item.category === 'rod')
			inventory.rod.push(item.id)
		if (item.category === 'ball')
			inventory.ball.push(item.id)
		if (item.category === 'sound')
			inventory.sound.push(item.id)
		await this.inventoryRepository.save(inventory)
 	}

// 	//deleteItem -> login + category + item
 	async deleteItem(login: string, category: string, item: string) {
//		const user = await this.userService.getUser(login)
//		await this.verificationCategory(category)
//		if (item === 'default')
//			throw new BadRequestException("Can't delete default items")
//		await this.verificationItemInCategory(category, item)
//		if (!(await this.isItem(login, category, item)))
//			throw new BadRequestException("User don't have this item")
//
//		const inventory = user.inventory
//		if (await this.isEquipped(login, category, item))
//			await this.unequipItem(login, category, item)
//		if (category === 'rod')
//			inventory.rod = [...inventory.rod.filter(i => i.name !== item)]
//		if (category === 'ball')
//			inventory.ball = [...inventory.ball.filter(i => i.name !== item)]
//		if (category === 'sound')
//			inventory.sound = [...inventory.sound.filter(i => i.name !== item)]
 	}

	//getEquipment -> login
	async getEquipment(login: string) {
		const user = await this.userService.getUser(login)

		const equipment = await this.equipmentRepository.findOneBy({id: user.id})
		const rod = await this.listItems.findOneBy({id: equipment.rod})
		const ball = await this.listItems.findOneBy({id: equipment.ball})
		const sound = await this.listItems.findOneBy({id: equipment.sound})
		return {
			rod: rod,
			ball: ball,
			sound: sound,
		};
	}

	//getECategory -> login + category
	async getECategory(login: string, category: string) {
		const user = await this.userService.getUser(login)
		await this.verificationCategory(category)

		const equipment = await this.equipmentRepository.findOneBy({id: user.id})
		if (category === 'rod')
			return await this.listItems.findOneBy({id: equipment.rod})
		if (category === 'ball')
			return await this.listItems.findOneBy({id: equipment.ball})
		if (category === 'sound')
			return await this.listItems.findOneBy({id: equipment.sound})
	}

//	//isEquipped -> login + category + item
	async isEquipped(login: string, category: string, item: string) {
		const user = await this.userService.getUser(login)
		await this.verificationCategory(category)
		await this.verificationItemInCategory(category, item)

		const equipment = await this.equipmentRepository.findOneBy({id: user.id})
		let itemToSearch
		if (category === 'rod')
			itemToSearch = await this.listItems.findOneBy({id: equipment.rod})
		if (category === 'ball')
			itemToSearch = await this.listItems.findOneBy({id: equipment.ball})
		if (category === 'sound')
			itemToSearch = await this.listItems.findOneBy({id: equipment.sound})
		return (itemToSearch.name === item)
	}

//	//equipItem -> login + category + item
	async equipItem(login: string, category: string, item: string) {
		const user = await this.userService.getUser(login)
		await this.verificationCategory(category)
		await this.verificationItemInCategory(category, item)

		const equipment = await this.equipmentRepository.findOneBy({id: user.id})
		const itemToEquip = await this.listItems.findOneBy({category: category, name: item})

		if (!(await this.isItem(login, category, item)))
			throw new BadRequestException("User don't have this item")

		if (category === 'rod')
			equipment.rod = itemToEquip.id
		if (category === 'ball')
			equipment.ball = itemToEquip.id
		if (category === 'sound')
			equipment.sound = itemToEquip.id
		return await this.equipmentRepository.save(equipment)
	}

//	//unequipItem -> login + category  -> Change Item to default
	async unequipItem(login: string, category: string, item: string) {
		const user = await this.userService.getUser(login)
		await this.verificationCategory(category)
		await this.verificationItemInCategory(category, item)

		const equipment = await this.equipmentRepository.findOneBy({id: user.id})
		if (!(await this.isEquipped(login, category, item)))
			throw new BadRequestException("Equipment is not equipped")
		if (category === 'rod')
			equipment.rod = (await this.listItems.findOneBy({category: 'rod', name: 'default'})).id
		if (category === 'ball')
			equipment.ball = (await this.listItems.findOneBy({category: 'ball', name: 'default'})).id
		if (category === 'sound')
			equipment.sound = (await this.listItems.findOneBy({category: 'sound', name: 'default'})).id
		return await this.equipmentRepository.save(equipment)
	}
}
