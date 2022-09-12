<template>
	<v-card rounded="xl" elevation="5" color="rgb(0, 0, 0, 0.7)"
			class="d-flex flex-column justify-center align-center pa-4">
		<v-card-title>
			{{ user.fa ? "Disable 2FA" : (next ? "Enable 2FA" : "Register on Authenticator") }}
		</v-card-title>
		<v-card-subtitle class="mt-2" >
			{{ user.fa ? "Enter your code to disable 2FA" : (next ? "Enter the code of your Google Authenticator application to activate 2FA" : "Use QR Code or text code to setup 2FA") }}
		</v-card-subtitle>
		<v-img v-if="qr !== '' && !next" :src="qr">
		</v-img>
		<v-card-subtitle v-if="!next" class="mt-2" > {{ code }} </v-card-subtitle>
		<v-otp-input v-if="user.fa || next" v-model="codeInput" dark> </v-otp-input>
		<v-card-actions>
			<v-btn v-if="!next && !user.fa" @click="next = true"> next </v-btn>
			<v-btn v-else @click="handleClick"> {{ user.fa ? "disable" : "enable" }} </v-btn>
		</v-card-actions>
		<v-snackbar v-model="snackShow" :color="snackColor" timeout="2000" > {{ snackText }} </v-snackbar>
	</v-card>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {disableTwoFaActivation, getTwoFaQR, validateTwoFaActivation} from "@/queries";

@Component({
	props: {
		user: Object
	},
	data: () => ({
		snackShow: false,
		snackText: "",
		snackColor: "green",
		qr: "",
		code: "",
		next: false,
		codeInput: ""
	}),
	methods: {
		showSnack(text: string, color: string) {
			this.$data.snackColor = color
			this.$data.snackText = text
			this.$data.snackShow = true
		},
		async getQr() {
			getTwoFaQR(this.$props.user.login)
				.then(r => {
					this.$data.qr = r.qr
					this.$data.code = r.code
			})
				.catch(() => {
					this.showSnack("Failed to enable 2FA, please reload the page", "red")
				})
		},
		async handleClick() {
			if (!this.$props.user.fa)
				await this.activateFA()
			else
				await this.disableFA()
		},
		async activateFA() {
			validateTwoFaActivation(this.$props.user.login, this.$data.codeInput)
				.then(() => {
					this.$emit("faStatus", true)
				})
				.catch(() => {
					this.showSnack("Invalid Code", "red")
				})
		},
		async disableFA() {
			disableTwoFaActivation(this.$props.user.login, this.$data.codeInput)
				.then(() => {
					this.$emit("faStatus", false)
				})
				.catch(() => {
					this.showSnack("Invalid Code", "red")
				})
		}
	},
	mounted() {
		if (!this.$props.user.fa)
			this.getQr()
	}
})
export default class ProfileSettingsAuthSecurity extends Vue {
}
</script>

<style scoped>

</style>
