import { Injectable } from '@nestjs/common';
import {UserService} from "../user/user.service";

@Injectable()
export class ProfileService {
	constructor(private readonly userService: UserService) {}


	getProfile(login: string) {
		return this.userService.users.find(users => users.login === login);
	}


}
