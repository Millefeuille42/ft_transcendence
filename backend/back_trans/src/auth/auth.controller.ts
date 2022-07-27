import {Controller, Get, Param, Post, Query, Res} from '@nestjs/common';
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
	addSomeone(@Res({passthrough: true}) response: Response, @Param('code') code: string, login: string) {
		this.authService.addSomeone(code).then(res => {
			login = res;
		})
		response.cookie('Session', login);
		console.log(login);
	}
}
