<template>
	<v-app-bar app flat dark class="grey darken-2">
		<NavTabs :Links=Links class="justify-center"></NavTabs>
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
		user: Object,
		Links: Array
	}
})
export default class AppBar extends Vue {
}
</script>

<style scoped>

</style>
