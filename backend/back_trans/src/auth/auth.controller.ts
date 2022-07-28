import {Controller, Get, Param, Post, Query, Redirect, Res} from '@nestjs/common';
import {Response} from 'express'
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get()
	@Redirect('http://localhost:3000')
	getAuth(@Query() query: { code: string }) {
		if (!query.code) {
			return {url: this.authService.getRedipage()};
		}
		else
			return {url: 'http://localhost:3000/auth/' + query.code};
	}

	@Get(':code') //-> Changer en Post
	async addSomeone(@Res({passthrough: true}) response: Response, @Param('code') code: string, login: string) {
		login = await this.authService.addSomeone(code);
		response.cookie('Session', login);
	}
}
