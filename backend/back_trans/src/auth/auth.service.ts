import {HttpException, Injectable, NotFoundException} from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import axios from "axios";
import {User} from "./auth.interface";

@Injectable()
export class AuthService {
	constructor(private configService: ConfigService) { }

	async getAccessToken(code: string): Promise<string> {
		const payload = {
			grant_type: "client_credentials",
			client_id: this.configService.get<string>('API_UID'),
			client_secret: this.configService.get<string>('API_SECRET'),
			redirect_uri: this.configService.get<string>('API_REDIR'),
			code,
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
			.then(function (res) { // Une fois que la requete est faite et a reussi, il faut donner une fonction a call
			ret = res.data.access_token; // Et en gros tu la definis la, la dite fonction
		})
			.catch((err) => {
				throw new HttpException(err.response.statusText + " on token grab", err.response.status);
			}); // Si la requete echoue
		return ret;
	}

	async findSomeone(code: string) {
		let access_token: string;
		let userData: User;
		try {
			access_token = await this.getAccessToken(code);
			await axios ({
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
						email: res.data.email,
						name: res.data.usual_full_name,
						avatar: res.data.image_url
					}
				})
				.catch((err) => {
					throw new HttpException(err.response.statusText, err.response.status);
				});
		}
		catch (err: any) {
			throw new HttpException(err.response, err.status);
		}
		return userData;
	}
}


