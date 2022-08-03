<template>
	<v-container fill-height class="align-content-start">
		<v-container style="background-color: black; height: 100%; border-radius: 20px; z-index: 1">
			<v-card style="position: relative" color="transparent" dark primary-title class="text-center">
				<v-card-title class="text--white justify-center">Welcome to PDF: Pong de Fou</v-card-title>
			</v-card>
			<video autoplay muted loop style="width: inherit; height: inherit; position: relative; filter: blur(10px)">
				<source src="@/assets/videoplayback.mp4"/>
			</video>
		</v-container>
	</v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({})
export default class HomeContent extends Vue {
}
</script>

<style scoped>
</style>
