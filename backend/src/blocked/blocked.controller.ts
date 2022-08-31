import {All, Controller, Get, Param, Req} from '@nestjs/common';
import {Request} from 'express'
import {BlockedService} from "./blocked.service";

@Controller('blocked')
export class BlockedController {
	constructor(private readonly blockedService: BlockedService) {}

	@Get(':login')
	blockedList(@Param('login') login: string) {
		return this.blockedService.blockedList(login);
	}

	@All(':login/:block')
	isBlocked(@Param('login') login: string,
			  @Param('block') block: string,
			  @Req() req: Request) {
		if (req.method === 'GET')
			return this.blockedService.isBlocked(login, block);
		if (req.method === 'POST')
			return this.blockedService.addBlock(login, block);
		if (req.method === 'DELETE')
			return this.blockedService.deleteBlock(login, block);
	}
}
