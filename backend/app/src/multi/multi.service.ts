import { Injectable } from '@nestjs/common';
import {matchPair} from "./matchUsers.interface";

@Injectable()
export class MultiService {
	findMatchIndex(matches: matchPair[], login: string): number {
		let i: number = -1
		matches.forEach((match: matchPair, index: number) => {
			if (match.first.login === login || match.second.login === login) {
				i = index
			}
		})
		return i
	}
}
