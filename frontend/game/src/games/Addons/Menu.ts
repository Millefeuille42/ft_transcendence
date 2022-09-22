import IScreen from "../../interfaces/IScreen";
import P5 from "p5";
import Button from "../../classes/genericClasses/Button";
import net, {getOnlineText} from "../../net";

class Menu implements IScreen {
	title: string
	buttons: Button[]

	buttonIndex: number = 0
	loaded: boolean = false
	stop: boolean = false

	constructor(title: string, buttons: Button[]) {
		this.title = title
		this.buttons = buttons
		this.buttons[this.buttonIndex].selected = true
	}

	screenPreload(p5: P5): void {}
	screenSetup(p5: P5): void {}
	loadScreen(p5: P5): void { this.screenPreload(p5); this.screenSetup(p5) }

	screenLoop(p5: P5): boolean {
		if (this.stop) {
			this.stop = false
			return true
		}

		if (!this.loaded) {
			p5.background(net.white ? "black" : "white")

			p5.fill(net.white ? "white" : "black")
			p5.stroke(net.white ? "black" : "white")
			p5.textSize(p5.width / 20)
			p5.text(this.title, 0, p5.height / 10, p5.width)

			p5.textSize(p5.width / 60)
			p5.text(getOnlineText(), p5.width - p5.width / 15, p5.height / 20)

			for (let bi in this.buttons) {
				this.buttons[bi].draw(p5)
			}
		} else {
			if (this.buttons[this.buttonIndex].act.screenLoop(p5)) {
				this.loaded = false
			}
		}
		return false
	}

	setKeyPressed(p5: P5): void {
		if (this.loaded) {
			this.buttons[this.buttonIndex].act.setKeyPressed(p5)
			return
		}

		console.log(p5.key)
		if (p5.key === "2") {
			net.white = true
		}
		if (p5.key === "1")
			net.white = false

		if (p5.key === "q") {
			this.stop = true
			return
		}

		if (p5.key === "Enter") {
			if (this.loaded)
				return
			this.buttons[this.buttonIndex].act.loadScreen(p5)
			this.loaded = true
			return
		}

		if (["ArrowUp", "ArrowDown"].indexOf(p5.key) < 0)
			return

		let action
		this.buttons[this.buttonIndex].selected = false
		if (p5.key === "ArrowUp") {
			action = () => { this.buttonIndex = this.buttonIndex === 0 ? this.buttons.length - 1 : --this.buttonIndex}
		} else if (p5.key === "ArrowDown") {
			action = () => {this.buttonIndex = (this.buttonIndex + 1) % this.buttons.length}
		}
		action()
		while (this.buttons[this.buttonIndex].disabled) {
			action()
		}
		this.buttons[this.buttonIndex].selected = true
	}

	setKeyReleased(p5: P5): void {
		if (this.loaded)
			this.buttons[this.buttonIndex].act.setKeyReleased(p5)
	}
}

export default Menu
