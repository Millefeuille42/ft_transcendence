import {Body, Controller, Get, Param, Post, Query, Req, Res} from '@nestjs/common';
import {Request, Response} from 'express'
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/**
	 * @api {get} /auth Request Auth Link
	 * @apiName getAuth
	 * @apiGroup auth
	 *
	 * @apiSuccess {String} link Link to redirect to user for connection
	 */
	@Get()
	async getAuth(@Query() query: { code: string }, @Req() req: Request, @Res() res: Response) {
		res.send({ page: this.authService.getRedipage() });
		return ;
	}

	/**
	 * @api {post} /auth/:code Add a user in the database
	 * @apiName addSomeone
	 * @apiGroup auth
	 *
	 * @apiParam {string} code Code return by intra
	 * @apiSuccess {Json} session Cookie to add to the user 'session : login'
	 */

	@Post(':code')
	async addSomeone(@Param('code') code: string, @Req() req: Request, @Res() res: Response) {

		let access_token: string = await this.authService.getAccessToken(code);
		const login: string = await this.authService.addSomeone(access_token);
		res.send({ session: login})
		return ;
	}

}