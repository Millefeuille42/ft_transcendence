<template>
	<div id="app">
		<v-app id="inspire">
			<TopBar Title="PDF: Pong De Fou" :Tabs="tabs"></TopBar>
			<v-main>
			<Component :is=currentComponent></Component>
			</v-main>
			<Drawer></Drawer>
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
import TopBar from "@/components/TopBar.vue";
import Drawer from "@/components/Drawer.vue";
import ContentSheet from "@/components/ContentSheet.vue"
import PlaceHolder from "@/components/PlaceHolder.vue";
import {EventBus} from "@/main";
import {Component, Vue} from "vue-property-decorator";

@Component( {
	components : {
		Drawer,
		TopBar,
		ContentSheet,
		PlaceHolder
	},
	data: () => ({
		collapseOnScroll: true,
		tabs: [
			{
				id: "about",
				title: "About",
				content: "ContentSheet"
			},
			{
				id: "news",
				title: "News",
				content: "PlaceHolder"
			},
			{
				id: "leaderboard",
				title: "Leaderboard",
				content: "smth"
			},
		],
		currentComponent: "contentSheet"
	}),
	created() {
		EventBus.$on("tabChanged", (tabId: string) => {
			const tab = this.$data.tabs.find((tab: {id: String, title: String, content: String}) => tab.id == tabId)
			this.$data.currentComponent = tab.content
		})
	}
})
export default class App extends Vue {}
</script>
