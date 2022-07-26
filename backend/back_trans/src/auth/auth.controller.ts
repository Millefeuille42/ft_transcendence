import {Controller, Get, Param, Query} from '@nestjs/common';
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
}
