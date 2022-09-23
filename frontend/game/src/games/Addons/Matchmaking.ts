import IScreen from "../../interfaces/IScreen";
import P5 from "p5";
import net from "../../net";
import Ready from "./Ready";
import {removeCookie, setCookie} from "typescript-cookie";

class Matchmaking implements IScreen {
	stop: boolean = false
	title: string = ""
	readyScreen: Ready = new Ready()


	loadScreen(p5: P5): void {
		this.screenPreload(p5)
		setTimeout(() => {
			this.screenSetup(p5)
		}, 500)
	}

	screenLoop(p5: P5): boolean {
		if (this.stop || net.hasError) {
			net.hasError = false
			this.stop = false
			net.socket.emit("multiReady", {
				id: net.match.id,
				ready: false
			})
			net.userReady = false
			return true
		}

		if (net.hasMatchUp) {
			if (this.readyScreen.firstTime) {
				this.readyScreen.loadScreen(p5)
				return false
			}
			return this.readyScreen.screenLoop(p5)
		}

		if (!this.readyScreen.firstTime || this.readyScreen.loaded) {
			this.readyScreen.loaded = false
			this.readyScreen.firstTime = true
		}
		p5.background(net.white ? "black" : "white")
		p5.textSize(p5.width / 20)
		p5.text(this.title, 0, p5.height / 2.5, p5.width)

		return false;
	}

	screenPreload(p5: P5): void {
		this.title = "Authenticating to server"
		let u = new URL(window.location.toString())
		removeCookie('Session')
		removeCookie('Login')
		setCookie("Login", u.searchParams.get("login"))
		setCookie("Session", u.searchParams.get("token"))
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
		if (net.hasMatchUp) {
			this.readyScreen.setKeyPressed(p5)
			return
		}
		if (p5.key === "q") {
			this.stop = true
			net.hasMatchUp = false
			net.auth = false
			net.opponentReady = false
			net.userReady = false
			net.socket.emit("multiLeave")
			return
		}
	}

	setKeyReleased(p5: P5): void {
		if (net.hasMatchUp) {
			this.readyScreen.setKeyReleased(p5)
			return
		}
	}

}

export default Matchmaking
