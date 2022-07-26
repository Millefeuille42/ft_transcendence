// noinspection JSSuspiciousNameCombination

import P5 from "p5"
import Button from "./classes/genericClasses/Button";
import LocalGame from "./games/LocalGame";
import Menu from "./games/Addons/Menu";
import Prompt from "./games/Addons/Prompt";
import Matchmaking from "./games/Addons/Matchmaking";
import net from "./net";
import SpectateScreen from "./games/Addons/SpectateScreen";
import IScreen from "./interfaces/IScreen";

let MultiMenu: Menu
let MainMenu: Menu
let JoinPrompt: Prompt
let JoinGame: IScreen
let ovrd: boolean

export const sketch = (p5: P5) => {
	let c_width = 200
	let c_height = 200

	p5.setup = () => {
		const parent = document.getElementById("app")
		if (parent !== null) {
			c_width = parent.clientWidth
			c_height = parent.clientHeight
		}
		if (c_width < c_height)
			c_height = c_width
		else
			c_width = c_height

		const canvas = p5.createCanvas(c_width, c_height)
		canvas.parent("app")
		p5.frameRate(60)
		p5.background(net.white ? "black" : "white")
		p5.textAlign("center")

		JoinPrompt = new Prompt("Enter room code", (val: string) => {
			ovrd = true
			JoinGame = new Matchmaking(true, val)
			JoinGame.loadScreen(p5)
		})

		MultiMenu = new Menu("Multiplayer", [
			new Button("Play", 0, new Matchmaking(), p5),
			new Button("Join", 1, JoinPrompt, p5),
		])

		MainMenu = new Menu("Pong De Fou", [
			new Button("Local", 0, new LocalGame(), p5, false),
			new Button("Multiplayer", 1, MultiMenu, p5),
			new Button("Spectate", 2, new SpectateScreen(), p5),
		])

		MainMenu.loadScreen(p5)
	}

	p5.draw = () => {
		if (ovrd && JoinGame !== undefined) {
			JoinGame.screenLoop(p5)
			return
		}
		if (MainMenu !== undefined)
			MainMenu.screenLoop(p5)
	}

	p5.keyPressed = () => {
		if (ovrd && JoinGame !== undefined) {
			JoinGame.setKeyPressed(p5)
			return
		}
		if (MainMenu !== undefined)
			MainMenu.setKeyPressed(p5)
	}

	p5.keyReleased = () => {
		if (ovrd && JoinGame !== undefined) {
			JoinGame.setKeyReleased(p5)
			return
		}
		if (MainMenu !== undefined)
			MainMenu.setKeyReleased(p5)
	}
}

new P5(sketch);
