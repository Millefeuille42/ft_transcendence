import IScreen from "../../interfaces/IScreen";
import P5 from "p5";
import net from "../../net";
import {removeCookie, setCookie} from "typescript-cookie";
import SpectatePreloader from "./SpectatePreloader";

class SpectateScreen implements IScreen {
	title: string = ""
	stop: boolean = false
	index: number = 0
	selected: string = ""
	preloader: SpectatePreloader = new SpectatePreloader()

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
			net.specMatches = undefined
			return true
		}
		p5.background(net.white ? "black" : "white")
		p5.fill(!net.white ? "black" : "white")
		p5.textSize(p5.width / 20)

		if (this.selected !== "") {
			if (this.preloader.firstTime) {
				this.preloader.loadScreen(p5)
				return false
			}
			return this.preloader.screenLoop(p5)
		}

		if (net.specMatches) {
			if (net.specMatches.length <= 0) {
				this.title = "No match to spectate"
			} else {
				this.title = "Select a match"
				p5.text(this.title, 0, p5.height / 4, p5.width)
				p5.textSize(p5.width / 30)
				let curMatch = net.specMatches[this.index]
				p5.text(`${curMatch.one} VS ${curMatch.two}`, 0 , p5.height / 2, p5.width)
				return false
			}
		}
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
			this.title = "Getting match list..."
			net.socket.emit("multiSpecList")
			return
		}
	}

	setKeyPressed(p5: P5): void {
		if (p5.key === "q") {
			window.location.reload()
			return
		}

		if (!net.specMatches || net.specMatches.length <= 0)
			return;

		if (p5.key === "Enter") {
			net.match.id = net.specMatches[this.index].id
			net.userLogin = net.specMatches[this.index].one
			net.match.login = net.specMatches[this.index].two
			this.selected = net.match.id
		}

		if (p5.key === "ArrowLeft") {
			if (this.index + 1 >= net.specMatches.length)
				return;
			this.index++
		}

		if (p5.key === "ArrowRight") {
			if (this.index === 0)
				return;
			this.index--
		}
	}

	setKeyReleased(p5: P5): void {
	}

}

export default SpectateScreen
