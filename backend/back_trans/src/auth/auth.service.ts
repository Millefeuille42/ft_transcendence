import {HttpException, Injectable, NotFoundException} from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import {UserService} from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import axios from "axios";
import {User} from "../user/user.interface";

@Injectable()
export class AuthService {
	constructor(public configService: ConfigService,
				private userService: UserService) { }

	async getAccessToken(code: string): Promise<string> {
		const payload = {
			grant_type: "authorization_code",
			client_id: this.configService.get<string>('API_UID'),
			client_secret: this.configService.get<string>('API_SECRET'),
			code: code,
			redirect_uri: this.configService.get<string>('API_REDIR'),
		};
	// TOKEN qui commence par fb = non authentifié
		let ret: string;
		await axios({
			method: "post",
			url: this.configService.get<string>('API') + "/oauth/token",
			data: JSON.stringify(payload),
			headers: {
				"content-type": "application/json",
			},
		})
			.then(function (res) { // Une fois que la requete est faite et a reussi, il faut donner une fonction a call
			ret = res.data.access_token; // Et en gros tu la definis la, la dite fonction
		})
			.catch((err) => {
				throw new HttpException(err.response.statusText + " on token grab", err.response.status);
			}); // Si la requete echoue
		return ret;
	}

	async addSomeone(access_token: string) {
		let userData: User;
		const login: string = await axios({
			method: "GET",
			url: this.configService.get<string>('API') + "/v2/me",
			headers: {
				Authorization: "Bearer " + access_token,
				"content-type": "application/json",
			},
		})
			.then(function (res) {
				userData = {
					login: res.data.login,
					username: res.data.login,
					email: res.data.email,
					name: res.data.usual_full_name,
					avatar: res.data.image_url,
					banner: ""
				}
				return ('');
			})
			.catch(async (err) => {
				if (err.response.status == 429) {
					await new Promise(f => setTimeout(f, +err.response.headers['retry-after'] * 1000))
					return this.addSomeone(access_token);
				}
				throw new HttpException(err.response.statusText, err.response.status);
			});
		if (login !== '')
			return login;
		this.userService.connectSession.set(userData.login, access_token);
		this.userService.users = [...this.userService.users, userData];
		return userData.login;
	}


	getRedipage() {
		return this.configService.get<string>('API_RED_URI');
	}
}


