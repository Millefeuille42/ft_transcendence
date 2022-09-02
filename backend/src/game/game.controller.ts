import {Body, Controller, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {GameService} from "./game.service";
import {AddStatsDto} from "./add-stats.dto";

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Get(':login/:resource')
	async getStats(@Param('login') login: string,
			 @Param('resource') resource: string) {
		if (resource === 'stats')
			return (await this.gameService.getStats(login))
		if (resource === 'wins')
			return await this.gameService.getWins(login)
		if (resource === 'looses')
			return await this.gameService.getLooses(login)
		if (resource === 'total')
			return await this.gameService.getTotal(login)
		if (resource === 'points')
			return await this.gameService.getPoints(login)
		if (resource === 'rival')
			return await this.gameService.getLastRival(login)
		if (resource === 'history')
			return await this.gameService.getHistory(login)
	}

	@Patch('points/:login')
	async fixPoints(@Param('login') login: string,
			  @Query() points: {points: number}) {
		console.log(points)
		return await this.gameService.fixPoints(login, points.points)
	}

	@Post(':login')
	async addStats(@Param('login') login: string,
			 @Body() stats: AddStatsDto) {
		console.log(stats)
		return (await this.gameService.addHistory(login, stats.rival, stats.points, stats.rPoints, stats.mode))
	}
}
