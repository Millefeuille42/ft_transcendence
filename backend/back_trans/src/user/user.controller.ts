import {Controller, Get, Param} from '@nestjs/common';
import {UserService} from "./user.service";

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('/:login/:ressource')
	getUser(@Param('login') login: string, @Param('ressource') ressource: string) {
		if (ressource === 'profile')
			return (this.userService.getUser(login));
		if (ressource === 'name')
			return (this.userService.getName(login));
		if (ressource === 'email')
			return (this.userService.getMail(login));
		if (ressource === 'avatar')
			return (this.userService.getAvatar(login));
		if (ressource === 'code')
			return (this.userService.getCode(login));
	}
}
