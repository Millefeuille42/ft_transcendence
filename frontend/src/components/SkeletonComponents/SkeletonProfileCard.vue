<template>
	<v-sheet class="mx-auto" max-width="100%" width="90%" :height="height" rounded="xl">
		<v-img height="100%" width="100%" lazy-src="@/assets/pong-bg.jpg" align="center"
			   style="border-radius: 20px">
			<v-sheet elevation="5" color="rgb(0, 0, 0, 0.2)"
					 style="backdrop-filter: blur(13px); -webkit-backdrop-filter: blur(13px); margin-top: 24px"
					 width="75%" max-width="24em" rounded="xl">
				<v-row class="pa-5">
					<v-col cols="12">
						<v-avatar class="profile" size="80">
							<v-skeleton-loader type="avatar"></v-skeleton-loader>
						</v-avatar>
					</v-col>
					<v-col class="py-0">
						<v-list-item dark>
							<v-list-item-content>
								<v-skeleton-loader type="list-item-two-lines, sentences" ></v-skeleton-loader>
							</v-list-item-content>
						</v-list-item>
					</v-col>
				</v-row>
			</v-sheet>
		</v-img>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({
	props: {
		height: String,
	},
})
export default class SkeletonProfileCard extends Vue {
}
</script>

<style scoped>

</style>
