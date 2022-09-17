import myVector from "./vector";
import P5 from "p5";
import Rod from "./Rod";

export class ballClass {
	position: myVector
	direction: myVector
	diametre: number
	texture: P5.Image
	collision: boolean

	constructor(x: number, y:number, dirX: number, dirY: number, p5: P5, texture: P5.Image) {
		this.position = new myVector(x, y)
		this.direction = new myVector(dirX, dirY)
		let oldX = this.direction.x
		this.direction.rotate(p5.random(-30, 30))
		if (p5.random(0, 2) > 1) {
			this.direction.y *= -1
		}
		this.direction.x = oldX
		this.diametre = p5.width * 0.030
		this.texture = texture
		this.collision = false
	}

	checkCollisionWithRod(r: Rod) {
		if (this.position.x < r.position.x + r.width &&
			this.position.x + this.diametre > r.position.x &&
			this.position.y < r.position.y + r.height &&
			this.position.y + this.diametre > r.position.y
		) {
			this.bounce(true)
			this.collision = true
		}
	}

	move(one: Rod, two: Rod, p5: P5): boolean {
		if (this.position.x + this.diametre >= two.position.x + two.width / 3 || this.position.x <= one.position.x + one.width - one.width / 3) {
			this.bounce(true)
			this.collision = true
			return true
		} else if (this.position.y + this.diametre >= p5.height  || this.position.y <= 0) {
			this.bounce(false)
			this.collision = true
		}

		this.checkCollisionWithRod(one)
		this.checkCollisionWithRod(two)

		this.position.translate(this.direction)
		return false
	}

	bounce(x: boolean) {
		if (x) {
			this.direction.x = -this.direction.x
		} else {
			this.direction.y = -this.direction.y
		}
	}

	draw(p5: P5) {
		p5.image(this.texture, this.position.x, this.position.y, this.diametre, this.diametre)
	}
}

export class Ball {
	let

	constructor() {
	}
}
