import IScreen from "../../interfaces/IScreen";
import P5 from "p5";
import net from "../../net";
import {equippedData, getEquipped, getUserData, userDataIn} from "../../queries";
import MultiGame from "../MultiGame";

class Ready implements IScreen {
	loaded: boolean = false
	firstTime: boolean = true

	me: userDataIn
	meInventory: equippedData
	opponent: userDataIn
	opponentInventory: equippedData

	multiGame: MultiGame = undefined

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

	getStatus(me: boolean): string {
		return (me ? this.me.username : this.opponent.username) + " -"
			+ (me ? (net.userReady ? " Ready" : "") : (net.opponentReady ? " Ready" : ""))
	}

	loadScreen(p5: P5): void {
		this.firstTime = false
		this.loadData().then(() => {
			this.loaded = true
		}).catch((e) => {
			window.location.reload()
		})
	}

	screenLoop(p5: P5): boolean {
		p5.background(net.white ? "black" : "white")
		if (net.matchStart) {
			if (this.multiGame === undefined) {
				this.multiGame = new MultiGame (
					{data: this.me, assets: this.meInventory},
					{data: this.opponent, assets: this.opponentInventory}
					)
				this.multiGame.loadScreen(p5)
			} else {
				let over = this.multiGame.screenLoop(p5)
				if (over) {
					window.location.reload()
					return true
				}
			}
			return false
		}
		if (this.loaded) {
			p5.textAlign('center')
			p5.textSize(p5.width / 20)
			p5.text("Let's get ready to ruuuumbleeee!", 0, p5.height / 4, p5.width)

			p5.textAlign('left')
			p5.textSize(p5.width / 25)

			p5.text(this.getStatus(true), p5.width / 4, p5.height / 2.4, p5.width / 1.4)
			p5.text(this.getStatus(false), p5.width / 4, p5.height / 2, p5.width / 1.4)

			p5.textAlign('center')
			p5.textSize(p5.width / 60)
			p5.text("Press Enter to get ready", 0, p5.height / 1.3, p5.width)
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
		if (net.matchStart && this.multiGame !== undefined) {
			this.multiGame.setKeyPressed(p5)
			return
		}
		if (p5.key === "q") {
			window.location.reload()
			return
		}

		if (p5.key === "Enter" && this.loaded) {
			net.socket.emit("multiReady", {
				id: net.match.id,
				ready: !net.userReady,
				width: p5.width,
				height: p5.height
			})
			net.userReady = !net.userReady
			return
		}
	}

	setKeyReleased(p5: P5): void {
		if (net.matchStart && this.multiGame !== undefined) {
			this.multiGame.setKeyReleased(p5)
			return
		}
	}

}

export default Ready
