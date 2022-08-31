import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {TmpDbService} from "../tmp_db/tmp_db.service";
import {UserService} from "../user/user.service";
import {stats} from "./stats.interface";

@Injectable()
export class GameService {
	constructor(private tmp_db: TmpDbService,
				private userService: UserService) {}

	verificationUsers(login: string, rival: string) {
		if (!(this.tmp_db.users.find(user => user.login === login)))
			throw new HttpException('User not found', HttpStatus.NOT_FOUND)
		if (!(this.tmp_db.users.find(user => user.login === rival)))
			throw new HttpException('Rival not found', HttpStatus.NOT_FOUND)
		if (login === rival)
			throw new HttpException('User can\'t be Rival', HttpStatus.BAD_REQUEST)
	}

	initStats(): stats {
		let stats: stats = {
			total: 0,
			win: 0,
			loose: 0,
			points: 5,
			lastRival: 'No one :(',
		}
		return(stats);
	}

	addStats(login: string, result: string, rival: string) {
		this.verificationUsers(login, rival)


		if (result === 'win') {

		}
		else if (result === 'loose') {

		}
		else
			throw new HttpException('Result must be a win or a loose', HttpStatus.BAD_REQUEST)
	}
}
