<template>
	<v-img width="100%" height="100%" src="@/assets/42.jpg" style="border-radius: 25px">
		<v-sheet width="100%" height="100%"
				 style="backdrop-filter: blur(11px); -webkit-backdrop-filter: blur(11px);"
				 class="d-flex flex-row justify-center " rounded="xl" color="rgb(0, 0, 0, 0.4)">
			<v-card min-width="300px" max-width="600px" width="60%" height="250px" rounded="xl" elevation="8" color="rgb(0, 0, 0, 0.7)"
					class="d-flex flex-column justify-center align-center pa-4 mt-6">
				<v-card-title>
					2FA Security
				</v-card-title>
				<v-card-subtitle class="mt-2" >
					Enter the code of your Google Authenticator application to log in
				</v-card-subtitle>
				<v-otp-input style="width: 80%;" v-model="codeInput" dark> </v-otp-input>
				<v-card-actions>
					<v-btn @click="handleClick"> Log in </v-btn>
				</v-card-actions>
				<v-snackbar v-model="snackShow" :color="snackColor" timeout="2000" > {{ snackText }} </v-snackbar>
			</v-card>
		</v-sheet>
	</v-img>

</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {validateTwoFaActivation} from "@/queries";

@Component({
	props: {
		login: String,
		session: String
	},
	data: () => ({
		snackShow: false,
		snackText: "",
		snackColor: "green",
		codeInput: ""
	}),
	methods: {
		showSnack(text: string, color: string) {
			this.$data.snackColor = color
			this.$data.snackText = text
			this.$data.snackShow = true
		},
		async handleClick() {
			this.$cookies.set('Login', this.$props.login)
			this.$cookies.set("Session", this.$props.session)
			validateTwoFaActivation(this.$props.login, this.$data.codeInput)
				.then(() => {
					this.$emit("FaLogin", true)
				})
				.catch(() => {
					// TODO Handle properly
					this.$cookies.remove('Login', this.$data.login)
					this.$cookies.remove("Session", this.$data.session)
					this.showSnack("Invalid Code", "red")
				})
		}
	}
})
export default class TwoFAPage extends Vue {
}
</script>

<style scoped>

</style>
