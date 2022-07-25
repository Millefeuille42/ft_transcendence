import {Controller, Get, Param} from '@nestjs/common';
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}



	@Get(':login')
	findSomeone(@Param('login') login: string) {
		return this.authService.findSomeone(login);
	}
}
