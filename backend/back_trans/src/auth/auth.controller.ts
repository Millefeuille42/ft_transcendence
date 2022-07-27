import {Controller, Get, Param, Query, Res} from '@nestjs/common';
import {Response} from 'express'
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}

	@Get()
	getAuth(@Query() query: { code: string }) {
		if (!query.code)
			return this.authService.getRedipage();
		else
			return query.code;
	}

	@Get(':code')
	async addSomeone(@Res({passthrough: true}) response: Response, @Param('code') code: string, login: string) {
		login = await this.authService.addSomeone(code);
		response.cookie('Session', login);
		console.log(login);
	}
}
