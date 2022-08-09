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
		res.send({ page: this.authService.getRedipage() });
		return ;
	}

	@Post(':code')
	async addSomeone(@Param('code') code: string, @Req() req: Request, @Res() res: Response) {

		let access_token: string = await this.authService.getAccessToken(code);
		const login: string = await this.authService.addSomeone(access_token);
		res.send({ session: login})
		return ;
	}

}

/**
 * @api {get} /auth Request Auth Link
 * @apiName getAuth
 * @apiGroup auth
 */
