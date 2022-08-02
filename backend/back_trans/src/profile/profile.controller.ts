import {Controller, Get, Param, Redirect, Req, Res} from '@nestjs/common';
import {ProfileService} from "./profile.service";
import {Request, Response} from 'express';
import {UserService} from "../user/user.service";
import {ConfigService} from "@nestjs/config";

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService,
				private readonly userService: UserService,
				private readonly configService: ConfigService) {}

	@Get()
	//@Redirect('http://localhost:3000')
	async getProfile(@Res({passthrough: true}) response: Response, @Req() request: Request) {
		const redir: string = this.configService.get<string>('HOST') + ':' + this.configService.get<string>('PORT');
		const cook: string = request.cookies['Session'];
		response.redirect(redir + '/profile/' + cook);
	}

	@Get(':login')
	getProfileUser(@Param('login') login: string) {
		return this.profileService.getProfile(login);
	}
}
