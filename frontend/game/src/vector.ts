const degsToRads = (deg: number) => (deg * Math.PI) / 180.0;

class myVector {
	x: number
	y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}

	translate(dir: myVector) {
		this.x += dir.x
		this.y += dir.y
	}

	rotate(angle: number) {
		let old: myVector = new myVector(this.x, this.y)

		this.x = old.x * Math.cos(degsToRads(angle)) - old.y * Math.sin(degsToRads(angle))
		this.y = old.x * Math.sin(degsToRads(angle)) + old.y * Math.cos(degsToRads(angle))
	}
}

export default myVector
