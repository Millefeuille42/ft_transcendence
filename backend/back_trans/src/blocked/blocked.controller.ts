import {All, Controller, Get, Param, Req} from '@nestjs/common';
import {Request} from 'express'
import {BlockedService} from "./blocked.service";
import {UserService} from "../user/user.service";

@Controller('blocked')
export class BlockedController {
	constructor(private readonly blockedService: BlockedService,
				private readonly userService: UserService) {}

	@Get(':login')
	blockedList(@Param('login') login: string) {
		return ;
	}

	@All(':login/:block')
	isBlocked(@Param('login') login: string,
			  @Param('block') block: string,
			  @Req() req: Request) {
		if (req.method === 'GET')
			return ;
		if (req.method === 'POST')
			return ;
		if (req.method === 'DELETE')
			return ;
	}
}
