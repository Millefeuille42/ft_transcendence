<template>
	<v-app-bar
		app
		flat
	>
		<v-avatar
			size="32"
			:color="$vuetify.breakpoint.smAndDown ? 'grey darken-1' : 'transparent'"
		/>

		<NavTabs :Links=Links></NavTabs>

		<v-avatar
			class="hidden-sm-and-down"
			color="grey darken-1 shrink"
			size="32"
		/>
	</v-app-bar>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import NavTabs from "@/components/NavTabs.vue";

@Component({
	components: {
		NavTabs
	},
	props: {
		Links: Array
	}
})
export default class AppBar extends Vue {
}
</script>

<style scoped>

</style>
