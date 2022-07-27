<template>
	<div id="app">
		<v-app id="inspire">
			<AppBar :Links=links :user=user :curTab=curTab />
			<v-main class="grey darken-3">
				<v-sheet color="transparent" width="100%" align="center" class="d-flex justify-center">
					<v-container>
						<v-row class="justify-center">
							<v-tabs-items v-model="curTab" style="background-color: transparent" dark>
								<v-tab-item>
									<DisplayContainer cols="12" sm="8" height="90vh" min_height="800">
										<HomeContent/>
									</DisplayContainer>
								</v-tab-item>
								<v-tab-item>
									<DisplayContainer cols="12" sm="8" height="90vh" min_height="800">
										<ChatContent :user=user :loaded="loaded"/>
									</DisplayContainer>
								</v-tab-item>
								<v-tab-item>
									<DisplayContainer cols="12" sm="8" height="90vh" min_height="50px">
										<ProfileContent :small=false :user=user />
									</DisplayContainer>
								</v-tab-item>
							</v-tabs-items>
						</v-row>
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
			profilePic: "https://picsum.photos/200/200?random",
			bannerPic: "https://picsum.photos/1920/1080?random",
			username: "Username",
			status: "status"
		},
	}),
	mounted () {
		setTimeout(() => {
			this.$data.loaded = true
		}, 1000)
	},
	destroyed() {
		window.removeEventListener('popstate', () => {})
	},
	created() {
		//TODO Grab user data from api
		this.$data.currentTab = window.location.hash.slice(1)
		let tabId = this.$data.links.findIndex((link: {text: String, icon: String, component: String}) => link.text == this.$data.currentTab)
		if (tabId < 0) {
			window.location.href = "#Home"
			tabId = 0
		}
		EventBus.$emit("routeTabChanged", tabId)
		this.$data.currentTab = this.$data.links[tabId].text
		this.$data.component = this.$data.links[tabId].component

		window.addEventListener('popstate', () => {
		if (window.location.hash == "#" + this.$data.currentTab)
			return
		this.$data.currentTab = window.location.hash.slice(1)
		let tabId = this.$data.links.findIndex((link: {text: String, icon: String, component: String}) => link.text == this.$data.currentTab)
		if (tabId >= 0)
			EventBus.$emit("routeTabChanged", tabId)
		})

		EventBus.$on("tabChanged", (id: number) => {
			window.location.href = "#" + this.$data.links[id].text
			this.$data.curTab = id
		})
	}
})
export default class App extends Vue {}
</script>
