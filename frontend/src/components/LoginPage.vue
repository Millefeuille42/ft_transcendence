<template>
	<v-img width="100%" height="100%" src="@/assets/42.jpg" style="border-radius: 25px">
		<v-sheet width="100%" height="100%"
				 style="backdrop-filter: blur(11px); -webkit-backdrop-filter: blur(11px);"
				 class="d-flex " rounded="xl" color="rgb(0, 0, 0, 0.4)">
			<v-card rounded="xl" elevation="5" color="rgb(0, 0, 0, 0.7)"
					:height="$vuetify.breakpoint.mobile ? '30%' : '15%'"
					:width="$vuetify.breakpoint.mobile ? '70%' : '50%'"
					class="d-flex mt-16 flex-column justify-center align-center ml-auto mr-auto pa-4">
				<v-card-title >Restricted access</v-card-title>
				<v-card-subtitle>You need to log in to access this content</v-card-subtitle>
				<v-card-actions>
					<v-btn @click="handleClick">
						Log in with 42
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-sheet>
	</v-img>
</template>

<script lang="ts">
import { RedirectToFTAuth } from "@/queries";
import {Component, Vue} from "vue-property-decorator";

@Component({
	methods: {
		handleClick() {
			RedirectToFTAuth()
		}
	}
})
export default class loginPage extends Vue {
}
</script>

<style scoped>

</style>
