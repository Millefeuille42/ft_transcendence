import IPair from "./IPair";

class Pair<F, S> implements IPair<F, S>{
	first
	second

	constructor(first: F, second: S) {
		this.first = first
		this.second = second
	}
}

export function makePair<F, S>(first: F, second: S) {
	return new Pair<F, S>(first, second)
}

export default Pair
