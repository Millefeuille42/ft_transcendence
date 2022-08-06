import {All, Controller, Get, Param, Req} from '@nestjs/common';
import {Request} from 'express'
import {ItemsService} from "./items.service";

@Controller('items')
export class ItemsController {
	constructor(private readonly itemsService: ItemsService) {}

	//Inventory
	@Get('inventory/:login')
	getInventory(@Param('login') login: string) {
		return (this.itemsService.getInventory(login))
	}

	@Get('inventory/:login/:category')
	getICategory(@Param('login') login: string,
				@Param('category') category: string) {
		return (this.itemsService.getICategory(login, category));
	}

	@All('inventory/:login/:category/:item')
	itemInventory(@Param('login') login: string,
				  @Param('category') category: string,
				  @Param('item') item: string,
				  @Req() req: Request) {
		if (req.method === 'GET')
			return (this.itemsService.isItem(login, category, item))
		if (req.method === 'POST')
			return (this.itemsService.addItem(login, category, item))
		if (req.method === 'DELETE')
			return (this.itemsService.deleteItem(login, category, item))
	}

	//Equipped
	@Get('equipped/:login')
	getEquipped(@Param('login') login: string) {
		return (this.itemsService.getEquipment(login));
	}

	@Get('equipped/:login/:category')
	getECategory(@Param('login') login: string,
				@Param('category') category: string) {
		return (this.itemsService.getECategory(login, category))
	}
//
	@All('equipped/:login/:category/:item')
	itemEquipped(@Param('login') login: string,
				  @Param('category') category: string,
				  @Param('item') item: string,
				  @Req() req: Request) {
		if (req.method === 'GET')
			return (this.itemsService.isEquipped(login, category, item))
		if (req.method === 'POST')
			return (this.itemsService.equipItem(login, category, item))
		if (req.method === 'DELETE')
			return (this.itemsService.unequipItem(login, category, item))
	}

}
