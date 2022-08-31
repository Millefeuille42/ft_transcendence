<template>
	<v-sheet elevation="5" color="rgb(0, 0, 0, 0.4)"
			 style="backdrop-filter: blur(13px); -webkit-backdrop-filter: blur(13px)"
			 class="pl-4 pr-4 d-flex flex-column justify-center"
			 width="90%" rounded="xl" height="45%">
		<slot></slot>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({})
export default class TransparentCard extends Vue {
}
</script>

<style scoped>

</style>
