<template>
	<v-card>
		<v-app-bar
			app
			absolute
			color="#6A76AB"
			dark
			shrink-on-scroll
			prominent
			src="https://picsum.photos/1920/1080?random"
			fade-img-on-scroll
			scroll-target="#scrolling-techniques-3"

		>
			<template v-slot:img="{ props }">
				<v-img
					v-bind="props"
					gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
				></v-img>
			</template>

			<NavDrawerButton/>
			<v-app-bar-title>{{ Title }}</v-app-bar-title>
			<v-spacer></v-spacer>
			<v-btn icon>
				<v-icon>mdi-account</v-icon>
			</v-btn>
			<template v-slot:extension>
				<v-tabs align-with-title>
					<TopBarTab v-for="tab in Tabs" :Id=tab.id :Title=tab.title> </TopBarTab>
				</v-tabs>
			</template>
		</v-app-bar>
	</v-card>
</template>

<style>

</style>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import NavDrawerButton from "@/components/NavDrawerButton.vue";
import Drawer from "@/components/Drawer.vue";
import TopBarTab from "@/components/TopBarTab.vue";
import {EventBus} from "@/main";

@Component({
	props: {
		Title : String,
		Tabs: Array
	},
	components: {Drawer, NavDrawerButton, TopBarTab},
	data: () => ({
		drawer: false,
		group: null
	}),

	watch: {
		group () {
			this.$data.drawer = false
		},
	}
})
export default class TopBar extends Vue {}
</script>
