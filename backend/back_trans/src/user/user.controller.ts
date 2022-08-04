import {Body, Controller, Get, Param, Patch} from '@nestjs/common';
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
		if (ressource === 'banner')
			return (this.userService.getBanner(login));
	}

	@Patch(':login/:ressource')
	changePicture(@Param('login') login: string, @Param('ressource') ressource: string, @Body() image: string) {
		if (ressource === 'avatar')
			return (this.userService.changeAvatar(login, image));
		if (ressource === 'banner')
			return (this.userService.changeAvatar(login, image));
	}
}