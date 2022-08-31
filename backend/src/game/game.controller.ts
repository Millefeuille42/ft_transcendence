import {Body, Controller, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {GameService} from "./game.service";
import {AddStatsDto} from "./add-stats.dto";

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Get(':login/:resource')
	getStats(@Param('login') login: string,
			 @Param('resource') resource: string) {
		if (resource === 'stats')
			return (this.gameService.getStats(login))
		if (resource === 'wins')
			return this.gameService.getWins(login)
		if (resource === 'looses')
			return this.gameService.getLooses(login)
		if (resource === 'total')
			return this.gameService.getTotal(login)
		if (resource === 'points')
			return this.gameService.getPoints(login)
		if (resource === 'rival')
			return this.gameService.getLastRival(login)
	}

	@Patch('points/:login')
	fixPoints(@Param('login') login: string,
			  @Query() points: {points: number}) {
		console.log(points)
		return this.gameService.fixPoints(login, points.points)
	}

	@Post(':login')
	addStats(@Param('login') login: string,
			 @Body() stats: AddStatsDto) {
		return this.gameService.addStats(login, stats.win, stats.rival)
	}
}
