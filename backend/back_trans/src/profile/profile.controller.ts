import {Controller, Get, Redirect, Req} from '@nestjs/common';
import {ProfileService} from "./profile.service";
import {Request} from 'express';
import {UserService} from "../user/user.service";
import {User} from "../auth/auth.interface";

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService,
				private readonly userService: UserService) {}

	@Get()
	@Redirect('http://localhost:3000')
	getProfile(@Req() request: Request) {
		const cook: string = request.cookies['Session'];
		if (!cook)
			return {url: 'http://localhost:3000/auth'}
		const user = this.userService.connectSession[cook];
		if (!user) {
			return {url: 'http://localhost:3000/auth'}
		}
		//Tester son token avec requête /me
		return this.profileService.getProfile(cook);
	}
}
