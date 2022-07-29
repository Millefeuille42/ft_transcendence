import {Controller, Get, Param, Redirect, Req, Res} from '@nestjs/common';
import {ProfileService} from "./profile.service";
import {Request, Response} from 'express';
import {UserService} from "../user/user.service";
import {User} from "../auth/auth.interface";
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
		console.log('il y a cookie ?')
		if (!cook) {
			console.log('Pas de cookie')
			response.redirect(redir + '/auth');
			return ;
		}
		const user: string = this.userService.getToken(cook);
		if (!user) {
			console.log('Pas dans la base de donnee')
			response.clearCookie('Session');
			console.log('bye bye cookie')
			response.redirect(redir + '/auth');
			return ;
		}
		const ret: boolean = await this.profileService.meRequest(user);
		if (!ret) {
			console.log('Token qui fonctionne pas')
			response.clearCookie('Session');
			console.log('bye bye cookie')
			this.userService.deleteToken(cook);
			response.redirect(redir + '/auth');
			return ;
		}
		console.log('noice')
		response.redirect(redir + '/profile/' + cook);
	}

	@Get(':login')
	getProfileUser(@Param('login') login: string) {
		return this.profileService.getProfile(login);
	}
}
