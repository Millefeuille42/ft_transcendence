import {Body, Controller, Get, Param, Post, Query, Redirect, Req, Res} from '@nestjs/common';
import {Request, Response} from 'express'
import {AuthService} from "./auth.service";
import {ConfigService} from "@nestjs/config";

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService,
				private configService: ConfigService) {}

	@Get()
	async getAuth(@Query() query: { code: string }, @Req() req: Request, @Res() res: Response) {
		console.log(this.authService.getRedipage())
		res.set('Access-Control-Allow-Origin', req.headers["origin"])
		res.set('Access-Control-Allow-Credentials', "true")
		res.send({ page: this.authService.getRedipage() });
		return ;
	}

	@Post(':code')
	async addSomeone(@Param('code') code: string, @Req() req: Request, @Res() res: Response) {
		let access_token: string = await this.authService.getAccessToken(code);
		const login: string = await this.authService.addSomeone(access_token);
		res.set('Access-Control-Allow-Origin', req.headers["origin"])
		res.set('Access-Control-Allow-Credentials', "true")
		res.send({ session: login})
		return ;
	}

	//@Get(':code') //-> Changer en Post
	//async addSomeone(@Res({passthrough: true}) response: Response, @Param('code') code: string, login: string) {
	//	login = await this.authService.addSomeone(code);
	//	response.cookie('Session', login);
	//	response.redirect(this.configService.get('HOST') + ':' + this.configService.get<string>('PORT') + '/profile');
	//}
}
