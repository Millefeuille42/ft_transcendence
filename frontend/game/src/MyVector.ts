const degsToRads = (deg: number) => (deg * Math.PI) / 180.0;

class MyVector {
	x: number
	y: number

	constructor(x: number = 0, y: number = 0) {
		this.x = x
		this.y = y
	}

	translate(dir: MyVector) {
		this.x += dir.x
		this.y += dir.y
	}

	rotate(angle: number) {
		let old: MyVector = new MyVector(this.x, this.y)

		this.x = old.x * Math.cos(degsToRads(angle)) - old.y * Math.sin(degsToRads(angle))
		this.y = old.x * Math.sin(degsToRads(angle)) + old.y * Math.cos(degsToRads(angle))
	}
}

export default MyVector
