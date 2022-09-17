import IScreen from "../../interfaces/IScreen";
import P5 from "p5";
import {getOnlineText} from "../../net";

class Prompt implements IScreen {
	title: string
	action: Function
	input: P5.Element
	sendButton: P5.Element
	quitButton: P5.Element

	constructor(title: string, action: Function) {
		this.title = title
		this.action = action
	}

	screenLoop(p5: P5): boolean {
		p5.background("black")

		p5.fill("white")
		p5.stroke("black")
		p5.textSize(p5.width / 20)
		p5.text(this.title, 0, p5.height / 5, p5.width)

		p5.textSize(p5.width / 60)
		p5.text(getOnlineText(), p5.width - p5.width / 15, p5.height / 20)

		return false
	}

	loadScreen(p5: P5): void {
		this.screenPreload(p5)
		this.screenSetup(p5)
	}

	screenPreload(p5: P5): void {
	}

	screenSetup(p5: P5): void {


		this.quitButton =
	}

	setKeyPressed(p5: P5): void {
	}

	setKeyReleased(p5: P5): void {
	}
}

export default Prompt
