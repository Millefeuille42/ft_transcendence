export class ChangePrivacyDto {
	readonly login: string;
	readonly public: boolean;
	readonly password?: string;
}