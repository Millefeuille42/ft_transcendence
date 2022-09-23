<template>
	<v-main class="grey darken-3">
		<v-sheet color="transparent" width="100%" height="100%" class="d-flex flex-row justify-center">
			<v-img max-width="700px" width="50%" height="50%" src="@/assets/42.jpg" class="mt-auto mb-auto" style="border-radius: 25px">
				<v-sheet width="100%" height="100%"
						 style="backdrop-filter: blur(11px); -webkit-backdrop-filter: blur(11px);"
						 class="d-flex " rounded="xl" color="rgb(0, 0, 0, 0.4)">
					<v-card rounded="xl" elevation="5" color="rgb(0, 0, 0, 0.7)"
							min-height="200px"
							dark
							:height="$vuetify.breakpoint.mobile ? '30%' : '15%'"
							:width="$vuetify.breakpoint.mobile ? '70%' : '50%'"
							class=" d-flex mt-16 flex-column justify-center align-center ml-auto mr-auto pa-4">
						<v-card-title >Unknown error</v-card-title>
						<v-card-subtitle>You encountered an unknown error, please reload this page in a few minutes</v-card-subtitle>
					</v-card>
				</v-sheet>
			</v-img>
		</v-sheet>
	</v-main>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({
})
export default class downPage extends Vue {
}
</script>

<style scoped>

</style>
