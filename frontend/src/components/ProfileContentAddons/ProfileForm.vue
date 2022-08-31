<template>
		<v-form height="100%" width="100%" v-model="valid" lazy-validation ref="form">
			<v-row>
				<v-col cols="12">
					<v-text-field
						v-model=formUsername
						:rules=usernameRules
						:counter=12
						label="Username"
						required
					></v-text-field>
				</v-col>
				<v-col cols="12">
					<v-text-field
						v-model="formProfilePic"
						prepend-icon="mdi-camera"
						label="Profile pic"
					></v-text-field>
				</v-col>
				<v-col cols="12">
					<v-text-field
						v-model="formBannerPic"
						accept="image/png, image/jpeg"
						prepend-icon="mdi-image-area"
						label="Banner pic"
					></v-text-field>
				</v-col>
				<v-col cols="12">
					<v-btn  class="mr-4" @click="formCheck"
					>submit</v-btn>
				</v-col>
			</v-row>
			<v-snackbar v-model="snackShow" :color="snackColor" timeout="2000" > {{ snackText }} </v-snackbar>
		</v-form>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {postForm} from "@/queries";
import {formDataOut} from "@/queriesData";
import {EventBus} from "@/main";

@Component({
	//TODO send user data to api
	data: () => ({
		valid: false,
		formUsername: "",
		formBannerPic: "",
		formProfilePic: "",
		usernameRules: [
			(v: string) => v.length <= 12 || 'Username must be less than 12 characters'
		],
		snackShow: false,
		snackText: "",
		snackColor: "green"
	}),
	props: {
		loaded: Boolean,
		user: Object
	},
	methods: {
		showSnack(text: string, color: string) {
			this.$data.snackColor = color
			this.$data.snackText = text
			this.$data.snackShow = true
		},
		async formCheck() {
			if (!this.$data.valid) {
				this.showSnack("Invalid data in the form", "red")
				return
			}
			if (this.$data.formUsername.length <= 12) {
				try {
					let formOut: formDataOut = {
						username: this.$data.formUsername,
						banner: this.$data.formBannerPic,
						avatar: this.$data.formProfilePic
					}
					await postForm(formOut, this.$props.user.login)
					EventBus.$emit("userChanged", "")
					this.showSnack("Profile updated", "green")
				} catch (e) {
					this.showSnack("Failed to update profile", "red")
				}
			}
		}
	},
	mounted() {
		this.$data.formUsername = this.$props.user.username
		this.$data.formProfilePic = this.$props.user.avatar
		this.$data.formBannerPic = this.$props.user.banner
	}
	//TODO add other form data send
})
export default class ProfileForm extends Vue {
}

</script>

<style scoped>

</style>
