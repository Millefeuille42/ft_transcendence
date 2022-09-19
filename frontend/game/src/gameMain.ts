import P5 from "p5"
import Button from "./classes/genericClasses/Button";
import LocalGame from "./games/LocalGame";
import Menu from "./games/Addons/Menu";
import Prompt from "./games/Addons/Prompt";
import Matchmaking from "./games/Addons/Matchmaking";

let MultiMenu: Menu
let MainMenu: Menu
let SpectatePrompt: Prompt
let JoinPrompt: Prompt

export const sketch = (p5: P5) => {
	let c_width = 200
	let c_height = 200

	p5.setup = () => {
		const parent = document.getElementById("app")
		if (parent !== null) {
			c_width = parent.clientWidth
			c_height = parent.clientHeight
		}

		const canvas = p5.createCanvas(c_width, c_height)
		canvas.parent("app")
		p5.frameRate(60)
		p5.background("black")
		p5.textAlign("center")

		SpectatePrompt = new Prompt("Enter room code", (val: string) => { console.log(val) })
		JoinPrompt = new Prompt("Enter room code", (val: string) => { console.log(val) })

		MultiMenu = new Menu("Multiplayer", [
			new Button("Play", 0, new Matchmaking(), p5),
			new Button("Join", 1, JoinPrompt, p5),
		])

		MainMenu = new Menu("Pong De Fou", [
			new Button("Local", 0, new LocalGame(), p5, false),
			new Button("Multiplayer", 1, MultiMenu, p5),
			new Button("Spectate", 2, SpectatePrompt, p5),
		])

		MainMenu.loadScreen(p5)
	}

	p5.draw = () => {
		MainMenu.screenLoop(p5)
	}

	p5.keyPressed = () => {
		MainMenu.setKeyPressed(p5)
	}

	p5.keyReleased = () => {
		MainMenu.setKeyReleased(p5)
	}
}

new P5(sketch);
