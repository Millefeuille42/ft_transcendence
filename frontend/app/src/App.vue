<template>
	<div id="app">
		<v-app id="inspire">
			<template v-if="!down">
				<AppBar :Links=links :user=user :curTab=curTab />
				<v-main class="grey darken-3">
					<!--suppress HtmlDeprecatedAttribute -->
					<v-sheet color="transparent" align="center" class="d-flex justify-center">
						<v-container>
								<v-tabs-items v-model="curTab" style="background-color: transparent" dark>
									<v-tab-item>
										<DisplayContainer cols="12" sm="8" height="88vh" min_height="" min-width="100%" width="100%">
											<HomeContent v-if="logged_in && loaded && displayGame" :user="user"/>
											<LoginPage v-if="!fa && !logged_in"/>
											<TwoFAPage @FaLogin="handleFALogin" :login="login" :session="session" v-if="fa && !logged_in"></TwoFAPage>
										</DisplayContainer>
									</v-tab-item>
									<v-tab-item>
										<DisplayContainer cols="12" sm="8" height="88vh" min_height="">
											<ChatContent v-if="logged_in && loaded" :user=user :auth="isAuth" :loaded="loaded"/>
											<LoginPage v-if="!fa && !logged_in"/>
											<TwoFAPage @FaLogin="handleFALogin" :login="login" :session="session" v-if="fa && !logged_in"></TwoFAPage>
										</DisplayContainer>
									</v-tab-item>
									<v-tab-item>
										<DisplayContainer cols="12" sm="8" height="88vh" min_height="50px"  min-width="100%" width="100%">
											<ProfileContent v-if="logged_in" :small=false :user=user :loaded="loaded"/>
											<LoginPage v-if="!fa && !logged_in"/>
											<TwoFAPage @FaLogin="handleFALogin" :login="login" :session="session" v-if="fa && !logged_in"></TwoFAPage>
										</DisplayContainer>
									</v-tab-item>
								</v-tabs-items>
						</v-container>
					</v-sheet>
				</v-main>
			</template>
			<DownPage v-else/>
		</v-app>
	</div>
</template>

<style>
</style>

<script lang="ts">
import {EventBus} from "@/main";
import {Component, Vue} from "vue-property-decorator";
import AppBar from "@/components/AppBar.vue";
import DisplayContainer from "@/components/DisplayContainer.vue";
import ProfileContent from "@/components/ProfileContent.vue";
import HomeContent from "@/components/HomeContent.vue";
import ChatContent from "@/components/ChatContent.vue";
import {getAuthResponse, RedirectToFTAuth, getUserData} from "@/queries";
import { userDataIn } from "./queriesData";
import LoginPage from "@/components/LoginPage.vue";
import DownPage from "@/components/DownPage.vue";
import TwoFAPage from "@/components/TwoFAPage.vue";

@Component( {
	components: {TwoFAPage, DownPage, LoginPage, DisplayContainer, AppBar, ProfileContent, HomeContent, ChatContent},
	data: () => ({
		isAuth: false,
		curTab: 0,
		component: "HomeContent",
		currentTab: "Home",
		loaded: false,
		logged_in: false,
		displayGame: true,
		down: false,
		fa: false,
		session: "",
		login: "",
		links: [
			{text: 'Home', icon:"mdi-home", component:"HomeContent"},
			{text: 'Chat', icon:"mdi-forum", component:"ChatContent"},
			{text: 'Profile', icon:"mdi-account-circle", component:"ProfileContent"}
		],
		user: {
			avatar: "https://picsum.photos/200/200?random",
			banner: "https://picsum.photos/1920/1080?random",
			username: "Username",
			login: "login",
			status: "online"
		},
	}),
	methods: {
		resetTabId() {
			this.$data.currentTab = window.location.hash.slice(1)
			let tabId = this.$data.links.findIndex((link: {text: String, icon: String, component: String}) => link.text == this.$data.currentTab)
			if (tabId < 0) {
				window.location.hash = "#Home"
				tabId = 0
			}
			EventBus.$emit("routeTabChanged", tabId)
			this.$data.currentTab = this.$data.links[tabId].text
			this.$data.component = this.$data.links[tabId].component
		},
		listenToTabChanged() {
			EventBus.$on("tabChanged", (id: number) => {
				window.location.hash = "#" + this.$data.links[id].text
				this.$data.curTab = id
			})
		},
		changeTab() {
			this.$data.displayGame = window.location.hash == '#Home'

			if (window.location.hash == "#" + this.$data.currentTab)
				return
			this.$data.currentTab = window.location.hash.slice(1)
			let tabId = this.$data.links.findIndex((link: {text: String, icon: String, component: String}) => link.text == this.$data.currentTab)
			if (tabId >= 0)
				EventBus.$emit("routeTabChanged", tabId)
		},
		async queryUserData() {
			const selfData: userDataIn = await getUserData(this.$cookies.get("Login") as string)
				.catch((e) => {
					// TODO add undefined protection
					if (e.response === undefined || e.response.status >= 401 && e.response.status <= 404) {
						this.$cookies.remove("Session")
						RedirectToFTAuth()
						return {} as userDataIn
					}
					EventBus.$emit("down", "")
					return {} as userDataIn
				})
			this.$data.user.username = selfData.username
			if (selfData.banner !== "")
				this.$data.user.banner= selfData.banner
			if (selfData.avatar !== "")
				this.$data.user.avatar = selfData.avatar
			this.$data.user.login = selfData.login
			this.$data.user.fa = this.$data.fa
			this.$data.loaded = true
		},
		async handleFALogin() {
			this.$data.logged_in = true
			await this.queryUserData()
			this.resetTabId()
		},
	},
	async mounted () {
		EventBus.$on('authSock', (data: boolean) => {
			setTimeout(() => {
				this.$data.isAuth = data
			}, 200)
		})
		this.$data.down = false
		try {
			if (this.$cookies.isKey("Session")) {
				this.$data.logged_in = true
				await this.queryUserData()
			}

			if ((new URL(window.location.toString())).searchParams.has("code")) {
				let session = await getAuthResponse()
				window.history.pushState('home', 'Home', "/")
				this.$data.fa = session.isTwoFA

				if (!session.isTwoFA) {
					this.$cookies.set('Login', session.cookie.Login)
					this.$cookies.set("Session", session.cookie.Session)
					this.$data.logged_in = true
					await this.queryUserData()
					this.resetTabId()
				} else {
					this.$data.login = session.cookie.Login
					this.$data.session = session.cookie.Session
				}
			}

		} catch (e) {
			EventBus.$emit("down", "")
		}
	},
	destroyed() {
		window.removeEventListener('popstate', () => {})
	},
	created() {
		this.$data.currentTab = window.location.hash.slice(1)
		let tabId = this.$data.links.findIndex((link: {text: String, icon: String, component: String}) => link.text == this.$data.currentTab)
		if (tabId < 0) {
			window.location.hash = "#Home"
			tabId = 0
		}
		EventBus.$emit("routeTabChanged", tabId)
		this.$data.currentTab = this.$data.links[tabId].text
		this.$data.component = this.$data.links[tabId].component

		window.addEventListener('popstate', () => {
			this.changeTab()
		})

		EventBus.$on("userChanged", async () => {
			await this.queryUserData()
			EventBus.$emit("userChangedDone", "")
		})

		EventBus.$on("down", () => {
			this.$data.down = true
		})
		this.listenToTabChanged()
	}
})
export default class App extends Vue {}
</script>
