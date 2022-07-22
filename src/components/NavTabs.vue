<template>
	<v-tabs
		centered
		class="ml-n9"
		color="grey darken-1"
	>
		<v-tab
			v-for="link in Links"
			:key=link
		>
			{{ link }}
		</v-tab>
	</v-tabs>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({
	props: {
		Links: Array
	}
})
export default class NavTabs extends Vue {
}
</script>

<style scoped>

</style>
