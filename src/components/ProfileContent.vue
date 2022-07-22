<template>
	<v-container fill-height class="align-content-start">
		<v-card
			class="mx-auto"
			max-width="100%"
			:height="small ? '100%' : '50%'"
			tile
		>
			<v-img height="100%" src="https://picsum.photos/1920/1080?random" align="center">
				<v-sheet elevation="5" color="rgb(0, 0, 0, 0.2)"
						 style="backdrop-filter: blur(13px); margin-top: 24px"
						 width="75%" max-width="24em">
					<v-row :class="small ? '' : 'pa-5'">
						<v-col align="center" cols="12">
							<v-avatar class="profile" :size="small ? '48' : '128'">
								<v-img src="https://picsum.photos/200/300"></v-img>
							</v-avatar>
						</v-col>
						<v-col class="py-0" align="center">
							<v-list-item dark>
								<v-list-item-content>
									<v-list-item-title class="text-h6">Username</v-list-item-title>
									<v-list-item-subtitle>Status</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
						</v-col>
					</v-row>
				</v-sheet>
			</v-img>
		</v-card>
	</v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({
	props: {
		small: Boolean
	},
})
export default class ProfileContent extends Vue {
}
</script>

<style scoped>

</style>
