import {forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {TmpDbService} from "../tmp_db/tmp_db.service";
import {UserService} from "../user/user.service";
import {EHistory, EStats, history, stats} from "./stats.interface";

@Injectable()
export class GameService {
	constructor(private tmp_db: TmpDbService,
				@Inject(forwardRef(() => UserService))
				private userService: UserService) {}

	async verificationUsers(login: string, rival: string) {
		let user = await this.userService.getUser(login)
		if (!user)
			throw new HttpException('User not found', HttpStatus.NOT_FOUND)
		user = await this.userService.getUser(rival)
		if (!user)
			throw new HttpException('Rival not found', HttpStatus.NOT_FOUND)
		if (login === rival)
			throw new HttpException('User can\'t be Rival', HttpStatus.BAD_REQUEST)
	}

	async initStats(login: string) {
		let stats: EStats = {
			login: login,
			total: 0,
			wins: 0,
			looses: 0,
			points: 5,
			lastRival: 'No one :(',
			history: [{}] as EHistory[]
		} as EStats
		//stats.history.push({
		//	login: login,
		//	rival: 'tester',
		//	userPoints: 5,
		//	rivalPoints: 2,
		//	gameMode: 'normal',
		//} as EHistory)
		return(stats);
	}

	async getStats(login: string) {
		const user = await this.userService.getUser(login)
		return user.stats
	}

	async getWins(login: string) {
		const user = await this.userService.getUser(login)
		return {wins: user.stats.wins}
	}

	async getLooses(login: string) {
		const user = await this.userService.getUser(login)
		return {looses: user.stats.looses}
	}

	async getTotal(login: string) {
		const user = await this.userService.getUser(login)
		return {total: user.stats.total}
	}

	async getPoints(login: string) {
		const user = await this.userService.getUser(login)
		return {points: user.stats.points}
	}

	async getLastRival(login: string) {
		const user = await this.userService.getUser(login)
		return {lastRival: user.stats.lastRival}
	}

	async getHistory(login: string) {
		const user = await this.userService.getUser(login)
		return {history: user.stats.history}
	}

	async fixPoints(login: string, points: number) {
		const user = await this.userService.getUser(login)
		if (points < 0)
			throw new HttpException('User can\'t have less of 0 point', HttpStatus.BAD_REQUEST)
		user.stats.points = points
		return {points: user.stats.points}
	}

	async addHistory(login: string, rival: string,
			   points: number, rivalPoints: number,
			   mode: string) {
		await this.verificationUsers(login, rival)
		const user = await this.userService.getUser(login)
		const game = {
			login: login,
			rival: rival,
			userPoints: points,
			rivalPoints: rivalPoints,
			gameMode: mode,
		} as EHistory
		//user.stats.history = [game, ...user.stats.history]
		console.log(user)
		//let result: history[] = user.stats.history
		//result = [...result, game]
		user.stats.history.push(game)
		return (this.addStats(login, points >= 5, rival))
	}

	async addStats(login: string, result: boolean, rival: string) {
		await this.verificationUsers(login, rival)
		let user = await this.userService.getUser(login);
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
