import {Controller, Get, Param, Post, Query, Redirect, Res} from '@nestjs/common';
import {Response} from 'express'
import {AuthService} from "./auth.service";
import {ConfigService} from "@nestjs/config";

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService,
				private configService: ConfigService) {}

	@Get()
	getAuth(@Query() query: { code: string }, @Res() res: Response) {
		if (!query.code) {
			res.redirect(this.authService.getRedipage());
		}
		else
			res.redirect(this.configService.get('HOST') + ':' + this.configService.get<string>('PORT') + '/auth/' + query.code);
	}

	@Get(':code') //-> Changer en Post
	async addSomeone(@Res({passthrough: true}) response: Response, @Param('code') code: string, login: string) {
		login = await this.authService.addSomeone(code);
		response.cookie('Session', login);
		console.log('nouvo cookie')
		response.redirect(this.configService.get('HOST') + ':' + this.configService.get<string>('PORT') + '/profile');
	}
}
