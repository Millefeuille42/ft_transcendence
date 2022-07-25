<template>
	<div id="app">
		<v-app id="inspire">
			<AppBar :Links=links :user=user />
			<v-main class="grey lighten-3">
				<v-container class="justify-center">
					<v-row class="justify-center">
						<DisplayContainer class="hidden-lg-and-down" cols="12" sm="2" height="268">
							<Component :is=components.left :small=true :user=user></Component>
						</DisplayContainer>

						<DisplayContainer cols="12" sm="8" height="70vh" min_height="800">
							<Component :is=components.middle :small=false :user=user></Component>
						</DisplayContainer>

						<DisplayContainer class="hidden-lg-and-down" cols="12" sm="2" height="268">
							<Component :is=components.right :small=true :user=user></Component>
						</DisplayContainer>
					</v-row>
				</v-container>
			</v-main>
		</v-app>
	</div>
</template>

<style>
html {
	overflow: hidden !important;
	scrollbar-width: none;
	-ms-overflow-style: none;
}

html::-webkit-scrollbar {
	width: 0;
	height: 0;
}

</style>

<script lang="ts">
import {EventBus} from "@/main";
import {Component, Vue} from "vue-property-decorator";
import AppBar from "@/components/AppBar.vue";
import DisplayContainer from "@/components/DisplayContainer.vue";
import ProfileContent from "@/components/ProfileContent.vue";

@Component( {
	components: {DisplayContainer, AppBar, ProfileContent},
	data: () => ({
		links: [
			{text: 'Home', icon:"mdi-home", left:"ProfileContent", middle:"empty", right:"empty"},
			{text: 'Play', icon:"mdi-microsoft-xbox-controller", left:"ProfileContent", middle:"empty", right:"empty"},
			{text: 'Chat', icon:"mdi-forum", left:"ProfileContent", middle:"empty", right:"empty"},
			{text: 'Profile', icon:"mdi-account-circle", left:"empty", middle:"ProfileContent", right:"empty"}
		],
		components: {
			left: "empty",
			middle: "empty",
			right: "empty",
		},
		user: {
			profilePic: "https://picsum.photos/200/200?random",
			bannerPic: "https://picsum.photos/1920/1080?random",
			username: "Username",
			status: "status"
		},
		currentTab: "Home"
	}),
	destroyed() {
		window.removeEventListener('popstate', () => {})
	},
	created() {
		this.$data.currentTab = window.location.hash.slice(1)
		let tabId = this.$data.links.findIndex((link: {text: String, icon: String, left: String, middle: String, right: String}) => link.text == this.$data.currentTab)
		if (tabId > 0) {
			this.$data.currentTab = this.$data.links[tabId].text
			this.$data.components.left = this.$data.links[tabId].left
			this.$data.components.middle = this.$data.links[tabId].middle
			this.$data.components.right = this.$data.links[tabId].right
			EventBus.$emit("routeTabChanged", tabId)
		} else {
			window.location.href = "#Home"
		}
		window.addEventListener('popstate', () => {
		if (window.location.hash == "#" + this.$data.currentTab)
			return
		this.$data.currentTab = window.location.hash.slice(1)
		let tabId = this.$data.links.findIndex((link: {text: String, icon: String, left: String, middle: String, right: String}) => link.text == this.$data.currentTab)
		if (tabId >= 0)
			EventBus.$emit("routeTabChanged", tabId)
		})
		EventBus.$on("tabChanged", (text: string) => {
			console.log("GOT tabChanged: ", text)
			const link = this.$data.links.find((link: {text: String, icon: String, left: String, middle: String, right: String}) => link.text == text)
			window.location.href = "#" + link.text
			this.$data.components.left = link.left
			this.$data.components.middle = link.middle
			this.$data.components.right = link.right
			this.$data.currentTab = link.text
		})
	}
})
export default class App extends Vue {}
</script>
