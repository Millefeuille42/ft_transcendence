<template>
	<v-sheet class="mx-auto" max-width="100%" height="30%" rounded="xl">
		<v-img height="100%" :src=user.bannerPic align="center"
			   style="border-radius: 20px" lazy-src="@/assets/pong-bg.jpg">
			<v-sheet elevation="5" color="rgb(0, 0, 0, 0.2)"
					 style="backdrop-filter: blur(13px); -webkit-backdrop-filter: blur(13px); margin-top: 24px"
					 width="75%" max-width="24em" rounded="xl">
				<v-row class="pa-5">
					<v-col cols="12">
						<v-avatar class="profile" size="80">
							<v-img :src=user.profilePic lazy-src="@/assets/42.jpg"></v-img>
						</v-avatar>
					</v-col>
					<v-col class="py-0">
						<v-list-item dark>
							<v-list-item-content>
								<v-list-item-title class="text-h6">{{ user.username }}</v-list-item-title>
								<v-list-item-subtitle>{{ user.status }}</v-list-item-subtitle>
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
	//TODO send user data to api
	props: {
		user: Object
	},
})
export default class ProfileCard extends Vue {
}
</script>

<style scoped>

</style>
