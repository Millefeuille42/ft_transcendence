import {Body, Controller, Get, Param, Patch} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto} from "./create-user.dto";

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
		if (ressource === 'banner')
			return (this.userService.getBanner(login));
		if (ressource === 'username')
			return (this.userService.getUsername(login));
	}

	@Patch(':login/:ressource')
	changeUser(@Param('login') login: string, @Param('ressource') ressource: string, @Body() change: CreateUserDto) {
		if (ressource === 'avatar') {
			this.userService.changeAvatar(login, change)
			return (this.userService.getAvatar(login));
		}
		if (ressource === 'banner') {
			this.userService.changeBanner(login, change)
			return (this.userService.getBanner(login));
		}
		if (ressource === 'username') {
			this.userService.changeUsername(login, change)
			return (this.userService.getUsername(login));
		}
	}
}
