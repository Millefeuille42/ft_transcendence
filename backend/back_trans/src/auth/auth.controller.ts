import {Controller, Get, Param, Post, Query, Redirect, Res} from '@nestjs/common';
import {Response} from 'express'
import {AuthService} from "./auth.service";
import {ConfigService} from "@nestjs/config";

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService,
				private configService: ConfigService) {}

	@Get()
	async getAuth(@Query() query: { code: string }, @Res() res: Response, login: string) {
		if (!query.code) {
			console.log(this.authService.getRedipage())
			res.send({ page: this.authService.getRedipage() });
			return ;
		}
		else {
			const code: string = query.code;
			let access_token: string = await this.authService.getAccessToken(code);
			login = await this.authService.addSomeone(access_token);
			res.send({session:login})
			//res.cookie('Session', login)
			//res.redirect(this.configService.get('HOST') + ':' + this.configService.get<string>('PORT') + '/profile/' + login)
		}
	}

	@Post(':code')
	addSomeone(@Param(code) code: string) {
		let access_token: string = await this.authService.getAccessToken(code);
		const login: string = await this.authService.addSomeone(access_token);
		return (login)
	}

	//@Get(':code') //-> Changer en Post
	//async addSomeone(@Res({passthrough: true}) response: Response, @Param('code') code: string, login: string) {
	//	login = await this.authService.addSomeone(code);
	//	response.cookie('Session', login);
	//	response.redirect(this.configService.get('HOST') + ':' + this.configService.get<string>('PORT') + '/profile');
	//}
}
