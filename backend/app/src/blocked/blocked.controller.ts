import {All, Controller, Get, Param, Req} from '@nestjs/common';
import {Request} from 'express'
import {BlockedService} from "./blocked.service";

@Controller('blocked')
export class BlockedController {
	constructor(private readonly blockedService: BlockedService) {}

	@Get(':login')
	async blockedList(@Param('login') login: string) {
		return await this.blockedService.blockedList(login);
	}

	@All(':login/:block')
	async isBlocked(@Param('login') login: string,
			  @Param('block') block: string,
			  @Req() req: Request) {
		if (req.method === 'GET')
			return await this.blockedService.isBlocked(login, block);
		if (req.method === 'POST')
			return await this.blockedService.addBlock(login, block);
		if (req.method === 'DELETE')
			return await this.blockedService.deleteBlock(login, block);
	}
}
