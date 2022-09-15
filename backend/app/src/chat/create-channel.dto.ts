export class CreateChannelDto {
	readonly name: string;
	readonly owner: string;
	readonly public: boolean;
	readonly password?: string;
}