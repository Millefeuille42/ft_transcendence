import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import axios from "axios";
import {User} from "./auth.interface";

@Injectable()
export class AuthService {
	constructor(private readonly _jwtService: JwtService, private readonly _configService: ConfigService) { }
	async getAccessToken(): Promise<string> {
		const payload = {
			grand_type: "client_credentials",
			client_id: "",
			client_secret: "",
		};

		let ret: string;
		await axios({
			method: "POST",
			url: "https://api.intra.42.fr/oauth/token",
			data: JSON.stringify(payload),
			headers: {
				"content-type": "application/json",
			},
		})
			.then(function (res) { // Une fois que la requete est faite et a reussi, il faut donner une fonction a call
			ret = res.data.access_token; // Et en gros tu la definis la, la dite fonction
		})
			.catch((err) => {}); // Si la requete echoue
		return ret;
	}

	async findSomeone(login: string) {
		let access_token: string;
		let userData: User;
		try {
			access_token = await this.getAccessToken();
			await axios ({
				method: "GET",
				url: "http://api.intra.42.fr/v2/users/" + login,
				headers: {
					authorization: `Bearer ${access_token}`,
					"content-type": "application/json",
				},
			})
				.then(function (res) {
					userData.login = res.data.login;
					userData.email = res.data.email;
					userData.first_name = res.data.first_name;
					userData.last_name = res.data.last_name;
				})
				.catch((err) => {});
		}
		catch (err: any) {}
		console.log(userData.login);
		return userData;
	}
}