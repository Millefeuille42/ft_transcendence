import MyVector from "./classes/genericClasses/MyVector";
import P5 from "p5";
import {Rod} from "./Rod";

export class Ball {
	position: MyVector = new MyVector(0, 0)
	direction: MyVector = new MyVector(0, 0)
	speed: number
	size: number

	constructor(p5: P5) {
		this.position.x = p5.width / 2
		this.position.y = p5.height / 2
		this.size = p5.width * 0.02
		this.speed = p5.width * 0.013
		this.direction.y = p5.random(-1, 1)
	}

	wallCollision(p5: P5): boolean {
		if (this.position.x < 0 || this.position.x > p5.width)
			return true
		if (this.position.y - this.size / 2 < 0)
			this.direction.y = Math.abs(this.direction.y)
		if (this.position.y + this.size / 2 > p5.height)
			this.direction.y = -Math.abs(this.direction.y)
	}

	rodCollision(rod: Rod) {
		let x: number
		if (rod.left)
			x = this.position.x - this.size / 2
		else
			x = this.position.x + this.size / 2

		if (x > rod.position.x &&
			x < rod.position.x + rod.width &&
			this.position.y > rod.position.y &&
			this.position.y < rod.position.y + rod.height
		) {
			this.direction.y = ((this.position.y - rod.position.y) / rod.height) - 0.5
			this.direction.x = Math.abs(this.direction.x)
			if (!rod.left)
				this.direction.x = -this.direction.x
		}
	}

	move(p5: P5, one: Rod, two: Rod): boolean {
		this.position.x += this.direction.x * this.speed
		this.position.y += this.direction.y * this.speed

		this.rodCollision(one)
		this.rodCollision(two)
		let goal: boolean = this.wallCollision(p5)
		this.direction.normalize()

		return goal
	}

	draw(p5: P5) {
		p5.ellipse(this.position.x, this.position.y, this.size, this.size)
	}
}
