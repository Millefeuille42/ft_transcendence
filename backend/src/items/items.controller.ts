import {All, Body, Controller, Delete, Get, Param, Post, Req} from '@nestjs/common';
import {Request} from 'express'
import {ItemsService} from "./items.service";
import {Items} from "./items.entity";

@Controller('items')
export class ItemsController {
	constructor(private readonly itemsService: ItemsService) {}

	@Get()
	async getAll() : Promise<Items[]> {
		return await this.itemsService.getAll()
	}

	@Post()
	async create(@Body() item: Items) : Promise<Items> {
		return await this.itemsService.createOneItem(item)
	}

	@Delete(':id')
	async deleteItem(@Param('id') id: string) {
		return await this.itemsService.removeItem(+id)
	}

	/**
	 * @api {get} /items/inventory/:login Request all items User have
	 * @apiName getInventory
	 * @apiGroup Items
	 *
	 * @apiParam {String} login Login of the user
	 *
	 * @apiSuccess {Json} rod All the rods of the user
	 * @apiSuccess {Json} ball All the balls of the user
	 * @apiSuccess {Json} sound All the sounds of the user
	 */
	@Get('inventory/:login')
	async getInventory(@Param('login') login: string) {
		return (await this.itemsService.getInventory(login))
	}


	/**
	 * @api {get} /items/inventory/:login/:category Get all the items User have in a category
	 * @apiName getICategory
	 * @apiGroup Items
	 *
	 * @apiParam {String} login Login of the user
	 * @apiParam {String} category Category requested <code>rod</code>,<code>ball</code> or <code>sound</code>
	 *
	 * @apiSuccess {Json} items All the items in the category requested
	 */
	@Get('inventory/:login/:category')
	async getICategory(@Param('login') login: string,
				@Param('category') category: string) {
		return (await this.itemsService.getICategory(login, category));
	}

	/**
	 * @api {get} items/inventory/:login/:category/:item Request if User have an item
	 * @apiName itemInventory
	 * @apiGroup Items
	 *
	 * @apiParam {String} login Login of the user
	 * @apiParam {String} category Category requested <code>rod</code>,<code>ball</code> or <code>sound</code>
	 * @apiParam {String} item Name of the <code>item</code> requested
	 *
	 * @apiSuccess {Boolean} res True if user have the item
	 */

	/**
	 * @api {post} items/inventory/:login/:category/:item Add an item in the inventory of a User
	 * @apiName itemInventory
	 * @apiGroup Items
	 *
	 * @apiParam {String} login Login of the user
	 * @apiParam {String} category Category requested <code>rod</code>,<code>ball</code> or <code>sound</code>
	 * @apiParam {String} item Name of the <code>item</code> requested
	 */

	/**
	 * @api {delete} items/inventory/:login/:category/:item Delete an item in the inventory of a User
	 * @apiName itemInventory
	 * @apiGroup Items
	 *
	 * @apiParam {String} login Login of the user
	 * @apiParam {String} category Category requested <code>rod</code>,<code>ball</code> or <code>sound</code>
	 * @apiParam {String} item Name of the <code>item</code> requested
	 */
	@All('inventory/:login/:category/:item')
	async itemInventory(@Param('login') login: string,
				  @Param('category') category: string,
				  @Param('item') item: string,
				  @Req() req: Request) {
		if (req.method === 'GET')
			return (await this.itemsService.isItem(login, category, item))
		if (req.method === 'POST')
			return (await this.itemsService.addItem(login, category, item))
		if (req.method === 'DELETE')
			return (await this.itemsService.deleteItem(login, category, item))
	}

	/**
	 * @api {get} items/equipped/:login Request equipment of a User
	 * @apiName getEquipped
	 * @apiGroup Items
	 *
	 * @apiParam {String} login Login of the user
	 *
	 * @apiSuccess {Json} equipment 3 items that <code>login</code> have equipped
	 */
	@Get('equipped/:login')
	async getEquipped(@Param('login') login: string) {
		return (await this.itemsService.getEquipment(login));
	}

	/**
	 * @api {get} items/equipped/:login/:category Get item equipped in a category of a User
	 * @apiName getECategory
	 * @apiGroup Items
	 *
	 * @apiParam {String} login Login of the user
	 * @apiParam {String} category Category requested <code>rod</code>,<code>ball</code> or <code>sound</code>
	 *
	 * @apiSuccess {Json} category Item equipped in the <code>category</code>
	 */
	@Get('equipped/:login/:category')
	async getECategory(@Param('login') login: string,
				@Param('category') category: string) {
		return (await this.itemsService.getECategory(login, category))
	}

	/**
	 * @api {get} items/equipped/:login/:category/:item Request if a User have an item equipped
	 * @apiName itemEquipped
	 * @apiGroup Items
	 *
	 * @apiParam {String} login Login of the user
	 * @apiParam {String} category Category requested <code>rod</code>,<code>ball</code> or <code>sound</code>
	 * @apiParam {String} item Name of the <code>item</code> requested
	 *
	 * @apiSuccess {Boolean} res True if <code>item</code> is equipped
	 */

	/**
	 * @api {post} items/equipped/:login/:category/:item Equip an item in User equipment
	 * @apiName itemEquipped
	 * @apiGroup Items
	 *
	 * @apiParam {String} login Login of the user
	 * @apiParam {String} category Category requested <code>rod</code>,<code>ball</code> or <code>sound</code>
	 * @apiParam {String} item Name of the <code>item</code> requested
	 */

	/**
	 * @api {delete} items/equipped/:login/:category/:item Unequip an item in User equipment
	 * @apiName itemEquipped
	 * @apiGroup Items
	 *
	 * @apiParam {String} login Login of the user
	 * @apiParam {String} category Category requested <code>rod</code>,<code>ball</code> or <code>sound</code>
	 * @apiParam {String} item Name of the <code>item</code> requested
	 */
	@All('equipped/:login/:category/:item')
	async itemEquipped(@Param('login') login: string,
				  @Param('category') category: string,
				  @Param('item') item: string,
				  @Req() req: Request) {
		if (req.method === 'GET')
			return (await this.itemsService.isEquipped(login, category, item))
		if (req.method === 'POST')
			return (await this.itemsService.equipItem(login, category, item))
		if (req.method === 'DELETE')
			return (await this.itemsService.unequipItem(login, category, item))
	}

	/**
	 * @api {get} items/drop/:login Drop an item and add it in inventory of a User
	 * @apiName dropItem
	 * @apiGroup Items
	 *
	 * @apiParam {String} login Login of the user
	 *
	 * @apiSuccess {Json} item The item drop
	 */
	@Get('drop/:login')
	async dropItem(@Param('login') login: string) {
		return (await this.itemsService.dropItem(login));
	}
}
