import {HttpException, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import axios from "axios";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class ProfileService {
	constructor(private readonly userService: UserService,
				private readonly configService: ConfigService) {}


	getProfile(login: string) {
		return this.userService.users.find(users => users.login === login);
	}

	async meRequest(token: string) {
		let ret: boolean;
		await axios({
			method: "GET",
			url: this.configService.get<string>('API') + "/v2/me",
			headers: {
				Authorization: "Bearer " + token,
				"content-type": "application/json",
			},
		})
			.then(() => {
				ret = true;
			})
			.catch(() => {
				ret = false
			});
		return ret;
	}

}
