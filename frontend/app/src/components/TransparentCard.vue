<template>
	<v-sheet elevation="5" color="rgb(0, 0, 0, 0.4)"
			 style="backdrop-filter: blur(13px); -webkit-backdrop-filter: blur(13px)"
			 class="pl-4 pr-4 d-flex flex-column justify-center"
			 :width="$vuetify.breakpoint.mobile ? '100%' : '90%'" rounded="xl"
			 :height=cHeight>
		<slot></slot>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({
	props: {
		cHeight: {
			type: String,
			default: "45%"
		}
	}
})
export default class TransparentCard extends Vue {
}
</script>

<style scoped>

</style>
