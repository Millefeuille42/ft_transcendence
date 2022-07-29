import {Controller, Get, Param, Redirect, Req, Res} from '@nestjs/common';
import {ProfileService} from "./profile.service";
import {Request, Response} from 'express';
import {UserService} from "../user/user.service";
import {User} from "../auth/auth.interface";

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService,
				private readonly userService: UserService) {}

	@Get()
	@Redirect('http://localhost:3000')
	getProfile(@Res({passthrough: true}) response: Response, @Req() request: Request) {
		const cook: string = request.cookies['Session'];
		if (!cook)
			return {url: 'http://localhost:3000/auth'}
		const user: string = this.userService.getToken(cook);
		if (!user) {
			response.clearCookie('Session');
			return {url: 'http://localhost:3000/auth'}
		}
		//Tester son token avec requête /me
		return {url: 'http://localhost:3000/profile/' + cook}
	}

	@Get(':login')
	getProfileUser(@Param('login') login: string) {
		return this.profileService.getProfile(login);
	}
}
