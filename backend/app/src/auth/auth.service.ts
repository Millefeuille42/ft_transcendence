import {HttpException, Injectable, UnauthorizedException} from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import {UserService} from "../user/user.service";
import axios from "axios";
import {CreateUser, CreateUserDto} from "../user/create-user.dto";

@Injectable()
export class AuthService {
	constructor(public configService: ConfigService,
				private userService: UserService) { }

	async meRequest(token: string) {
		return await axios({
			method: "GET",
			url: this.configService.get<string>('API') + "/v2/me",
			headers: {
				Authorization: "Bearer " + token,
				"content-type": "application/json",
			},
		})
			.then(() => {
				return true;
			})
			.catch(async (err) => {
				if (err.response.status == 429) {
					await new Promise(f => setTimeout(f, +err.response.headers['retry-after'] * 1000))
					return this.meRequest(token);
				}
				throw new UnauthorizedException("meRequest doesn't work")
				return false
			});
	}

	async getAccessToken(code: string): Promise<string> {
		const payload = {
			grant_type: "authorization_code",
			client_id: this.configService.get<string>('API_UID'),
			client_secret: this.configService.get<string>('API_SECRET'),
			code: code,
			redirect_uri: this.configService.get<string>('API_REDIR'),
		};
		let ret: string;
		await axios({
			method: "post",
			url: this.configService.get<string>('API') + "/oauth/token",
			data: JSON.stringify(payload),
			headers: {
				"content-type": "application/json",
			},
		})
			.then(function (res) {
				ret = res.data.access_token;
		})
			.catch((err) => {
				if (err.response && err.response.statusText && err.response.status)
					throw new HttpException(err.response.statusText + " on token grab", err.response.status);
				return false
			});
		return ret;
	}

	async addSomeone(access_token: string) {
		let userData: CreateUser;
		let that = this;
		const login: string = await axios({
			method: "GET",
			url: this.configService.get<string>('API') + "/v2/me",
			headers: {
				Authorization: "Bearer " + access_token,
				"content-type": "application/json",
			},
		})
			.then(async function (res) {
				userData = {
					login: res.data.login,
					email: res.data.email,
					name: res.data.usual_full_name,
					avatar: res.data.image_url,
				}
				const otherLogin = await that.userService.isUsernameExist(userData.login)
				if (otherLogin.userExist) {
					const otherUser: CreateUserDto = {username: otherLogin.login}
					await that.userService.changeUsername(otherLogin.login, otherUser)
				}
				return ('');
			})
			.catch(async (err) => {
				if (err.response && err.response.statusText && err.response.status) {
					if (err.response.status == 429) {
						await new Promise(f => setTimeout(f, +err.response.headers['retry-after'] * 1000))
						return this.addSomeone(access_token);
					}
					else
						throw new HttpException(err.response.statusText, err.response.status);
				}
				else
					throw err
			});
		if (login !== '')
			return login;
		await this.userService.initSession(userData.login, access_token)
		const us = await this.userService.userExist(userData.login)
		if (us) {
			await this.userService.checkUser(userData.login)
			await this.userService.changeOnline(userData.login, {online: true})
			return (userData.login);
		}

		await this.userService.initUser(userData)
		return userData.login;
	}


	getRedipage() {
		return this.configService.get<string>('API_RED_URI');
	}

	async isAuth(login: string, uuid: string) {
		if (!login || !uuid) {
			return false ;
		}
		const token: string = await this.userService.getToken(login);
		const uuidSession = await this.userService.getUuidSession(login)

		if (!token) {
			if (uuid === uuidSession)
				await this.userService.deleteUuidSession(login)
			return false ;
		}
		if (uuidSession !== uuid) {
			return false
		}

		const ret: boolean = await this.meRequest(token);
		if (!ret) {
			await this.userService.deleteToken(login)
			await this.userService.deleteUuidSession(login)
			return false
		}
		return true;
	}
}


