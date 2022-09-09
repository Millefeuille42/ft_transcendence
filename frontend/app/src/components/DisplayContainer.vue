<template>
		<v-sheet rounded="xl" :height=height :min-height=min_height elevation="4">
			<slot></slot>
		</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({
	props: {
		cols: String,
		sm: String,
		min_height: String,
		height: String
	}
})
export default class DisplayContainer extends Vue {
}
</script>

<style scoped>

</style>
