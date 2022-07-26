import {Controller, Get, Param, Post, Query, Request} from '@nestjs/common';
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get()
	getAuth(@Query() query: { code: string}) {
		if (!query.code)
			return this.authService.getRedipage();
		else
			return query.code;
	}

	@Get(':code')
	findSomeone(@Param('code') code: string) {
		return this.authService.findSomeone(code);
	}

	@Post('login')
	async login(@Request() req) {
		return this.authService.login(req.user);
	}
}
