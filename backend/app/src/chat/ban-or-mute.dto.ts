export class BanOrMuteDto {
	readonly login: string;
	readonly target: string;
	readonly channel: string;
	readonly time: Date;
}