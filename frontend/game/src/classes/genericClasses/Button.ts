import P5 from "p5";
import net from "../../net";
import IScreen from "../../interfaces/IScreen";

class Button {
	selected: boolean = false
	disabled: boolean = false
	online: boolean = false
	x: number
	y: number
	w: number
	h: number
	text_y: number
	text: string
	act: IScreen

	constructor(text: string, position: number, act: IScreen, p5: P5, online: boolean = true) {
		const y = p5.height / 24 * (10 + 3 * position)

		this.w = p5.width / 4
		this.h = p5.height / 15

		this.x = p5.width / 2 - this.w / 2
		this.y = y - this.h / 2
		this.text_y = y - this.h / 4

		this.text = text
		this.act = act

		this.online = online
	}

	drawBox(p5: P5) {
		if (this.selected) {
			p5.strokeWeight(0)
			p5.fill("white")
		} else if (this.disabled) {
			p5.strokeWeight(5)
			p5.fill("black")
			p5.stroke("grey")
		} else  {
			p5.strokeWeight(5)
			p5.fill("black")
			p5.stroke("white")
		}
		p5.rect(this.x, this.y, this.w, this.h)
	}

	drawText(p5: P5) {
		if (this.selected)
			p5.fill("black")
		else if (this.disabled)
			p5.fill("grey")
		else
			p5.fill("white")
		p5.strokeWeight(0)
		p5.textSize(p5.height / 35)
		p5.text(this.text, this.x, this.text_y, this.w, this.h)
	}

	draw(p5: P5) {
		this.disabled = !net.socket.connected && this.online;
		this.drawBox(p5)
		this.drawText(p5)
	}
}

export default Button
