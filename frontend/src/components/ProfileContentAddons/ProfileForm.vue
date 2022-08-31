<template>
		<v-form height="100%" width="100%" v-model="valid" lazy-validation>
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
						:rules=usernameRules
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
		</v-form>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {postFormUsername} from "@/queries";

@Component({
	//TODO send user data to api
	data: () => ({
		valid: false,
		formUsername: "",
		formBannerPic: "",
		formProfilePic: "",
		picRules: [
			(value: any) =>	!value || "No file provided!",
			(value: any) => value.size < 2500000 || "File size must be less than 25MB!"
		],
		usernameRules: [
			(v: string) => v.length <= 12 || 'Username must be less than 12 characters'
		],
	}),
	props: {
		loaded: Boolean,
		user: Object
	},
	methods: {
		async formCheck() {
			if (!this.$data.valid) {
				alert("Wrong data")
				return
			}
			if (this.$data.formUsername.length <= 12) {
				try {
					this.$props.user.username = await postFormUsername(this.$data.formUsername, this.$props.user.login)
				} catch (e) {
					console.log(e)
				}
			}
		}
	},
	mounted() {
		this.$data.formUsername = this.$props.user.username
	}
	//TODO add other form data send
})
export default class ProfileForm extends Vue {
}

</script>

<style scoped>

</style>
