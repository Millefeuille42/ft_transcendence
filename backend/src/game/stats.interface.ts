export interface history {
	rival: string,
	userPoints: number,
	rivalPoints: number,
	gameMode: string,
}

export interface stats {
	total: number,
	wins: number,
	looses: number,
	points: number,
	lastRival: string,
	history: history[],
}