<template>
	<div id="app">
		<v-app id="inspire">
			<AppBar :Links=links :user=user :curTab=curTab />
			<v-main class="grey darken-3">
				<v-sheet color="transparent" align="center" class="d-flex justify-center">
					<v-container>
							<v-tabs-items v-model="curTab" style="background-color: transparent" dark>
								<v-tab-item>
									<DisplayContainer cols="12" sm="8" height="90vh" min_height="800" min-width="100%" width="100%">
										<HomeContent/>
									</DisplayContainer>
								</v-tab-item>
								<v-tab-item>
									<DisplayContainer cols="12" sm="8" height="90vh" min_height="800">
										<ChatContent :user=user :loaded="loaded"/>
									</DisplayContainer>
								</v-tab-item>
								<v-tab-item>
									<DisplayContainer cols="12" sm="8" height="90vh" min_height="50px"  min-width="100%" width="100%">
										<ProfileContent :small=false :user=user :loaded="loaded"/>
									</DisplayContainer>
								</v-tab-item>
							</v-tabs-items>
					</v-container>
				</v-sheet>
			</v-main>
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
import axios from 'axios';
import {getAuthResponse, RedirectToFTAuth, getUserData} from "@/queries";
import { userDataIn } from "./queriesData";

function getCook(cookieName: string)
{
	let cookieString=RegExp(cookieName+"=[^;]+").exec(document.cookie);
	return decodeURIComponent(!!cookieString ? cookieString.toString().replace(/^[^=]+./,"") : "");
}

@Component( {
	components: {DisplayContainer, AppBar, ProfileContent, HomeContent, ChatContent},
	data: () => ({
		curTab: 0,
		component: "HomeContent",
		currentTab: "Home",
		loaded: false,
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
			if (window.location.hash != "#Home" && !this.$cookies.isKey("Session")) {
				this.$data.loaded = false
				RedirectToFTAuth()
			}
			if (window.location.hash == "#" + this.$data.currentTab)
				return
			this.$data.currentTab = window.location.hash.slice(1)
			let tabId = this.$data.links.findIndex((link: {text: String, icon: String, component: String}) => link.text == this.$data.currentTab)
			if (tabId >= 0)
				EventBus.$emit("routeTabChanged", tabId)
		},
		async queryUserData() {
			const selfData: userDataIn = await getUserData(this.$cookies.get("Session"))
			this.$data.user.username = selfData.username
			if (selfData.banner !== "")
				this.$data.user.banner= selfData.banner
			if (selfData.avatar !== "")
				this.$data.user.avatar = selfData.avatar
			this.$data.user.login = selfData.login
			this.$data.loaded = true
		}
	},
	async mounted () {
		try {
			if (this.$cookies.isKey("Session")) {
				await this.queryUserData()
			}

			if (window.location.pathname === "/auth") {
				await RedirectToFTAuth()
			} else if (window.location.pathname === "/auth/response") {
				let session = await getAuthResponse()
				this.$cookies.set("Session", session)
				window.history.pushState('home', 'Home', "/")
				await this.queryUserData()
				this.resetTabId()
			}

		} catch (e) {
			console.log(e)
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

		this.listenToTabChanged()
	}
})
export default class App extends Vue {}
</script>
