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
			wins: 0,
			looses: 0,
			points: 5,
			lastRival: 'No one :(',
			history: []
		}
		return(stats);
	}

	getStats(login: string) {
		const user = this.userService.getUser(login)
		return user.stats
	}

	getWins(login: string) {
		const user = this.userService.getUser(login)
		return {wins: user.stats.wins}
	}

	getLooses(login: string) {
		const user = this.userService.getUser(login)
		return {looses: user.stats.looses}
	}

	getTotal(login: string) {
		const user = this.userService.getUser(login)
		return {total: user.stats.total}
	}

	getPoints(login: string) {
		const user = this.userService.getUser(login)
		return {points: user.stats.points}
	}

	getLastRival(login: string) {
		const user = this.userService.getUser(login)
		return {lastRival: user.stats.lastRival}
	}

	getHistory(login: string) {
		const user = this.userService.getUser(login)
		return {history: user.stats.history}
	}

	fixPoints(login: string, points: number) {
		const user = this.userService.getUser(login)
		if (points < 0)
			throw new HttpException('User can\'t have less of 0 point', HttpStatus.BAD_REQUEST)
		user.stats.points = points
		return {points: user.stats.points}
	}

	addHistory(login: string, rival: string,
			   points: number, rivalPoints: number,
			   mode: string) {
		this.verificationUsers(login, rival)
		const user = this.userService.getUser(login)
		const game = {
			rival: rival,
			userPoints: points,
			rivalPoints: rivalPoints,
			gameMode: mode,
		}
		user.stats.history = [game, ...user.stats.history]
		return (this.addStats(login, points >= 5, rival))
	}

	addStats(login: string, result: boolean, rival: string) {
		this.verificationUsers(login, rival)
		let user = this.userService.getUser(login);
		console.log(result)
		if (result) {
			user.stats.wins++
			user.stats.points += 2
		}
		else if (!result) {
			user.stats.looses++
			user.stats.points++
		}
		else
			throw new HttpException('Result must be a win or a loose', HttpStatus.BAD_REQUEST)
		user.stats.total++
		user.stats.lastRival = rival
		return user.stats
	}
}
