import {HttpException, Injectable} from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import {UserService} from "../user/user.service";
import axios from "axios";
import {User} from "../user/user.interface";
import {ItemsService} from "../items/items.service";
import {TmpDbService} from "../tmp_db/tmp_db.service";
import {CreateUser, CreateUserDto} from "../user/create-user.dto";
import {GameService} from "../game/game.service";
import {UsersList} from "../entities/users.entity";

@Injectable()
export class AuthService {
	constructor(public configService: ConfigService,
				private userService: UserService,
				private itemsService: ItemsService,
				private tmp_db: TmpDbService,
				private gameService: GameService) { }

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
				if (err.response.status == 429) {
					await new Promise(f => setTimeout(f, +err.response.headers['retry-after'] * 1000))
					return this.addSomeone(access_token);
				}
				throw new HttpException(err.response.statusText, err.response.status);
			});
		if (login !== '')
			return login;
		this.userService.connectSession.set(userData.login, access_token);
		const us = await this.userService.getUser(userData.login)
		if (us) {
			console.log("User already exist")
			//2fa
			await this.userService.changeOnline(userData.login, {online: true})
			return (userData.login);
		}

		await this.userService.initUser(userData)

		//this.tmp_db.users = [...this.tmp_db.users, userData];
		this.userService.changeOnlineInDB({login: userData.login, online: true})
		//console.log(this.userService.onlinePeople.has('tester'))
		return userData.login;
	}


	getRedipage() {
		return this.configService.get<string>('API_RED_URI');
	}
}


