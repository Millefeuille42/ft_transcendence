import IScreen from "../../interfaces/IScreen";
import P5 from "p5";
import net from "../../net";

function getStatus(me: boolean): string {
	return (me ? net.userLogin : net.match.login) + " -"
		+ (me ? (net.userReady ? " Ready" : "") : (net.opponentReady ? " Ready" : ""))
}

class Matchmaking implements IScreen{
	stop: boolean = false
	title: string = ""


	loadScreen(p5: P5): void {
		this.screenPreload(p5)
		setTimeout(() => {
			this.screenSetup(p5)
		}, 500)
	}

	screenLoop(p5: P5): boolean {
		if (this.stop) {
			this.stop = false
			net.socket.emit("multiReady", {
				id: net.match.id,
				ready: false
			})
			net.userReady = false
			return true
		}
		if (net.hasError) {
			net.hasError = false
			return true
		}

		p5.background('black')

		if (net.hasMatchUp) {
			p5.textAlign('center')
			p5.textSize(p5.width / 20)
			p5.text("Let's get ready to ruuuumbleeee!", 0, p5.height / 4, p5.width)

			p5.textAlign('left')
			p5.textSize(p5.width / 25)

			p5.text(getStatus(true), p5.width / 4, p5.height / 2.4, p5.width / 1.4)
			p5.text(getStatus(false), p5.width / 4, p5.height / 2, p5.width / 1.4)

			p5.textAlign('center')
			p5.textSize(p5.width / 60)
			p5.text("Press Enter to get ready", 0, p5.height / 1.3, p5.width)
			return false
		}

		p5.textSize(p5.width / 20)
		p5.text(this.title, 0, p5.height / 2.5, p5.width)

		return false;
	}

	screenPreload(p5: P5): void {
		this.title = "Authenticating to server"
		let u = new URL(window.location.toString())
		net.userLogin = u.searchParams.get("login")
		net.userToken = u.searchParams.get("token")
		net.socket.emit("multiAuth", {
			token: net.userToken,
			login: net.userLogin
		})
	}

	screenSetup(p5: P5): void {
		if (net.auth) {
			this.title = "Looking for a match..."
			net.socket.emit("multiQueue", {oper: "add"})
			return
		}
		this.stop = true
	}

	setKeyPressed(p5: P5): void {
		if (p5.key === "q") {
			this.stop = true
			net.hasMatchUp = false
			net.auth = false
			net.opponentReady = false
			net.userReady = false
			net.socket.emit("multiLeave")
			return
		}

		if (p5.key === "Enter") {
			net.socket.emit("multiReady", {
				id: net.match.id,
				ready: !net.userReady
			})
			net.userReady = !net.userReady
			return
		}
	}

	setKeyReleased(p5: P5): void {
	}

}

export default Matchmaking
