import IScreen from "../../interfaces/IScreen";
import P5 from "p5";
import net from "../../net";
import {equippedData, getEquipped, getUserData, userDataIn} from "../../queries";
import MultiGame from "../MultiGame";
import SpectateGame from "../SpectateGame";

class SpectatePreloader implements IScreen {
	loaded: boolean = false
	firstTime: boolean = true

	me: userDataIn
	meInventory: equippedData
	opponent: userDataIn
	opponentInventory: equippedData

	specGame: SpectateGame = undefined

	async loadData() {
		await getUserData(net.userLogin).then((data) => {
			console.log(data)
			this.me = data
		})
		await getUserData(net.match.login).then((data) => {
			this.opponent = data
		})
		await getEquipped(net.userLogin).then((data) => {
			this.meInventory = data
		})
		await getEquipped(net.match.login).then((data) => {
			this.opponentInventory = data
		})
	}

	loadScreen(p5: P5): void {
		this.firstTime = false
		this.loadData().then(() => {
			this.loaded = true
		}).catch(() => {
			window.location.reload()
		})
	}

	screenLoop(p5: P5): boolean {
		p5.background(net.white ? "black" : "white")
		if (this.loaded) {
			if (this.specGame === undefined) {
				this.specGame = new SpectateGame (
					{data: this.me, assets: this.meInventory},
					{data: this.opponent, assets: this.opponentInventory}
				)
				this.specGame.loadScreen(p5)
			} else {
				let over = this.specGame.screenLoop(p5)
				if (over) {
					window.location.reload()
					return true
				}
			}
			return false
		}
		p5.textSize(p5.width / 20)
		p5.text("Loading assets", 0, p5.height / 2.5, p5.width)
		return false
	}

	screenPreload(p5: P5): void {
	}

	screenSetup(p5: P5): void {
	}

	setKeyPressed(p5: P5): void {
		if (p5.key === "q") {
			window.location.reload()
			return
		}
	}

	setKeyReleased(p5: P5): void {
	}

}

export default SpectatePreloader
