<template>
	<v-tabs centered class="ml-n9" color="grey lighten-3" v-model="selectedTab" fixed-tabs>
		<v-tab v-for="link in Links" :key=link.text>
				<v-container class="hidden-xs-only text--white">
					{{ link.text }}
				</v-container>
				<v-icon class="hidden-sm-and-up">
					{{ link.icon }}
				</v-icon>
		</v-tab>
	</v-tabs>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {EventBus} from "@/main";

@Component({
	props: {
		Links: Array,
		curTab: Number,
	},
	data: () => ({
		selectedTab: null
	}),
	watch: {
		selectedTab () {
			console.log("Selected: ", this.$data.selectedTab)
			EventBus.$emit("tabChanged", this.$data.selectedTab)
		}
	},
	created() {
		this.$data.currentTab = window.location.hash.slice(1)
		let tabId = this.$props.Links.findIndex((link: {text: String, icon: String, left: String, middle: String, right: String}) => link.text == this.$data.currentTab)
		if (tabId > 0) {
			this.$data.selectedTab = tabId
		} else {
			window.location.href = "#Home"
		}
		EventBus.$on("routeTabChanged", (id: number) => {
			console.log("Got: ", id)
			this.$data.selectedTab = id
		})
	}
})
export default class NavTabs extends Vue {
}
</script>

<style scoped>

</style>
