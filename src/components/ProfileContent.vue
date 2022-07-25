<template>
	<v-container fill-height class="align-content-start">
		<v-sheet
			class="mx-auto"
			max-width="100%"
			:height="small ? '100%' : '50%'"
			rounded="xl"
		>
			<v-img height="100%" :src=user.bannerPic align="center" style="border-radius: 20px">
				<v-sheet elevation="5" color="rgb(0, 0, 0, 0.2)"
						 style="backdrop-filter: blur(13px); -webkit-backdrop-filter: blur(13px); margin-top: 24px"
						 width="75%" max-width="24em" rounded="xl">
					<v-row :class="small ? '' : 'pa-5'">
						<v-col cols="12">
							<v-avatar class="profile" :size="small ? '48' : '128'">
								<v-img :src=user.profilePic></v-img>
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
		<v-sheet v-if="!small" class="pa-5 mt-5" width="25%" height="45%" rounded="xl" elevation="4" min-height="365px">
			<v-form height="100%" width="100%" v-model="valid" lazy-validation>
				<v-row>
					<v-col cols="12">
						<v-text-field
							v-model=formUsername
							:rules=usernameRules
							:counter=12
							label="Username"
							:placeholder=user.username
							required
						></v-text-field>
					</v-col>

					<v-col cols="12">
						<v-file-input
							show-size
							chips
							placeholder="Change your profile pic"
							v-model="formProfilePic"
							:rules=picRules
							accept="image/png, image/jpeg"
							prepend-icon="mdi-camera"
							label="Profile pic"
						></v-file-input>
					</v-col>

					<v-col cols="12">
						<v-file-input
							v-model="formBannerPic"
							:rules=picRules
							accept="image/png, image/jpeg"
							placeholder="Change your banner pic"
							prepend-icon="mdi-image-area"
							label="Banner pic"
						></v-file-input>
					</v-col>

					<v-col cols="12">
							<v-btn
							class="mr-4"
							@click="formCheck"
						>submit</v-btn>
					</v-col>
				</v-row>
			</v-form>
		</v-sheet>
	</v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({
	data: () => ({
		valid: false,
		formUsername: "",
		formBannerPic: undefined,
		formProfilePic: undefined,
		picRules: [
			(value: any) =>	!value || "No file provided!",
			(value: any) => value.size < 2500000 || "File size must be less than 25MB!"
		],
		usernameRules: [
			(v: string) => v.length <= 12 || 'Username must be less than 12 characters'
		],
	}),
	props: {
		small: Boolean,
		user: Object
	},
	methods: {
		formCheck() {
			if (!this.$data.valid)
				alert("Wrong data")
			if (this.$data.formUsername.length <= 12)
				this.$props.user.username = this.$data.formUsername
		}
	},
	created() {
		this.$data.formUsername = this.$props.user.username
	}
})
export default class ProfileContent extends Vue {
}
</script>

<style scoped>

</style>
