import {myVector} from "@/game/vector";
import P5 from "p5";
import {rod} from "@/game/rod";

export class ballClass {
	position: myVector
	direction: myVector
	diametre: number

	constructor(x: number, y:number, dirX: number, dirY: number, p5: P5) {
		this.position = new myVector(x, y)
		this.direction = new myVector(dirX, dirY)
		this.direction.rotate(p5.random(-30, 30))
		if (p5.random(0, 2) > 1) {
			this.direction.y *= -1
		}
		this.diametre = p5.width * 0.015
	}

	checkCollisionWithRod(r: rod, left: Boolean) {
		if (!(this.position.y >= r.position.y && this.position.y <= r.position.y + r.height)) {
			return ;
		}

		if (!left && this.direction.x > 0 &&
			this.position.x + this.diametre >= r.position.x &&
				this.position.x + this.diametre <= r.position.x + r.width) {
			this.bounce(true)
		}

		if (left && this.direction.x < 0 &&
			this.position.x - this.diametre >= r.position.x &&
				this.position.x - this.diametre <= r.position.x + r.width) {
			this.bounce(true)
		}
	}

	move(one: rod, two:rod, p5: P5): boolean {
		let goal = false

		if (this.position.x >= p5.width - this.diametre || this.position.x <= this.diametre) {
			this.bounce(true)
			goal = true
		} else if (this.position.y >= p5.height - this.diametre || this.position.y <= this.diametre) {
			this.bounce(false)
		}

		this.checkCollisionWithRod(one, true)
		this.checkCollisionWithRod(two, false)

		this.position.translate(this.direction)
		return goal
	}

	bounce(x: boolean) {
		if (x) {
			this.direction.x = -this.direction.x
		} else {
			this.direction.y = -this.direction.y
		}
	}

	draw(p5: P5) {
		p5.noStroke()
		p5.ellipse(this.position.x, this.position.y, this.diametre, this.diametre)
	}
}
