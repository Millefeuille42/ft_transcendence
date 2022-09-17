import MyVector from "./MyVector";
import P5 from "p5";
import Rod from "./Rod";

class Ball {
	speed: number
	size: number
	position: MyVector = new MyVector
	direction: MyVector = new MyVector

	constructor(p5:P5, left: boolean) {
		this.speed = p5.width * 0.01
		this.size = p5.width * 0.015
		this.position.x = p5.width / 2
		this.position.y = p5.height / 2
		this.direction.x = left ? -1 : 1
		this.randomize(p5)
	}

	randomize(p5:P5) {
		this.direction.y = p5.random(-1, 1)
	}

	rodCollision(rod:Rod) {
		let x = this.position.x + (this.size / (rod.left ? -2 : 2))

		if (
			x > rod.position.x &&
			x < rod.position.x + rod.width &&
			this.position.y > rod.position.y &&
			this.position.y < rod.position.y + rod.height
		) {
			this.direction.x = Math.abs(this.direction.x) * (rod.left ? 1 : -1);
			this.direction.y = ((this.position.y - rod.position.y) / rod.height) - 0.5;
		}
	}

	wallCollision(p5:P5): boolean {
		// Left Right walls, do not collide but return goal
		if (this.position.x - this.size <= 0 || this.position.x + this.size >= p5.width) {
			return true
		}

		// Top Down walls, invert y direction
		if (this.position.y - this.size <= 0 || this.position.y + this.size >= p5.height) {
			this.direction.y *= -1
		}
		return false
	}

	collide(p5:P5, one:Rod, two:Rod): boolean {
		this.rodCollision(one)
		this.rodCollision(two)
		return this.wallCollision(p5)
	}

	move() {
		this.position.x += this.direction.x * this.speed
		this.position.y += this.direction.y * this.speed
	}

	draw(p5:P5) {
		p5.ellipse(this.position.x, this.position.y, this.size)
	}

	update(p5:P5, one:Rod, two:Rod): boolean {
		if (this.collide(p5, one, two))
			return true
		this.move()
		return false
	}
}

export default Ball
