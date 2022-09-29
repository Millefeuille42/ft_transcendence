<template>
	<v-form width="100%" class="d-flex flex-column justify-space-between"
			style="height: 70%"
			v-model="valid" lazy-validation ref="form">
		<v-text-field
			class="mr-auto ml-auto"
			:style="'width: ' + ($vuetify.breakpoint.mobile ? '80%' : '30%') + ';'"
			v-model=formUsername
			:rules=usernameRules
			:counter=12
			label="Username"
			required
		></v-text-field>
		<v-file-input
			show-size
			ref="sexe"
			v-model="formAvatar"
			class="mr-auto ml-auto"
			:style="'width: ' + ($vuetify.breakpoint.mobile ? '100%' : '70%' )+ ';'"
			accept="image/png, image/jpeg"
			prepend-icon="mdi-camera"
			label="Profile pic"
		></v-file-input>
		<v-file-input
			show-size
			v-model="formBanner"
			class="mr-auto ml-auto"
			:style="'width: ' + ($vuetify.breakpoint.mobile ? '100%' : '70%') + ';'"
			accept="image/png, image/jpeg"
			prepend-icon="mdi-image-area"
			label="Banner pic"
		></v-file-input>
		<v-sheet class="mr-auto ml-auto d-flex flex-row justify-center"
				 :width="$vuetify.breakpoint.mobile ? '40%' : '40%'">
			<v-btn class="mr-4" width="20%" @click="formCheck"
			> {{ $vuetify.breakpoint.mobile ? '' : 'Submit' }}
				<v-icon v-if="$vuetify.breakpoint.mobile" >
					mdi-receipt-text-check-outline
				</v-icon>
			</v-btn>
			<v-btn @click="handleFA"
				   :color="user.fa ? 'green' : ''"
				   class="ml-4"
				   width="20%"
				   min-width="120px"
			> {{ $vuetify.breakpoint.mobile ? '' : (user.fa ? 'Disable 2FA' : 'Enable 2FA') }}
				<v-icon v-if="$vuetify.breakpoint.mobile" >
					mdi-shield-lock
				</v-icon>
			</v-btn>
		</v-sheet>
		<v-dialog v-if="!reload" v-model="faButton" width="90%" max-width="400px" dark>
			<ProfileSettingsAuthSecurity v-if="faButton" @faStatus="changeFa" :user="user" />
		</v-dialog>
		<v-snackbar v-model="snackShow" :color="snackColor" timeout="2000" > {{ snackText }} </v-snackbar>
	</v-form>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {postForm} from "@/queries";
import {formDataOut} from "@/queriesData";
import {EventBus} from "@/main";
import ProfileSettingsAuthSecurity
	from "@/components/ProfileContentAddons/ProfileSettingsAddons/ProfileSettingsAuthSecurity.vue";

@Component({
	components: {ProfileSettingsAuthSecurity},
	data: () => ({
		valid: false,
		formUsername: "",
		formAvatar: undefined as unknown as File,
		formBanner: undefined as unknown as File,
		formProfilePic: "",
		usernameRules: [
			(v: string) => v.length < 12 || 'Username must be less than 12 characters'
		],
		snackShow: false,
		snackText: "",
		snackColor: "green",
		faButton: false,
		reload: false
	}),
	props: {
		loaded: Boolean,
		user: Object
	},
	methods: {
		handleFA() {
			this.$data.faButton = true
		},
		showSnack(text: string, color: string) {
			this.$data.snackColor = color
			this.$data.snackText = text
			this.$data.snackShow = true
		},
		async formCheck() {
			let that = this
			this.$data.valid = true

			if (this.$data.formAvatar) {
				this.$data.formAvatar.onload = function () {
					console.log("fersses")
					if (!this.width) {
						that.$data.valid = false
					}
				};
			}

			if (this.$data.formBanner) {
				this.$data.formBanner.onload = function () {
					if (!this.width) {
						that.$data.valid = false
					}
				};
			}


			if (!this.$data.valid) {
				this.$data.valid = true
				this.showSnack("Invalid data in the form", "red")
				return
			}
			const encode = (file: File) => new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = (() => {
					resolve(reader.result as string)
				});
				reader.onerror = error => reject(error);
			})

			const toBuffer = (file: any) => new Promise<ArrayBuffer>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = (() => {
					resolve(reader.result as ArrayBuffer)
				});
				reader.readAsArrayBuffer(file)
				reader.onerror = error => reject(error);
			})

			const check = (file: ArrayBuffer) => new Promise<Boolean>((resolve, reject) => {
				let bytes = new Uint8Array(file);
				if ((bytes[0] == 0xFF) && (bytes[1] == 0xD8))
					resolve(true)
				else if ((bytes[0] == 0x89) && (bytes[1] == 0x50))
					resolve(true)
				else
					resolve(false)
			})

			try {
				if (this.$data.formUsername.length <= 0 || this.$data.formUsername.length >= 12 || this.$data.formUsername === this.$props.user.username) {
					throw new Error("T'as cru quoi (feur)")
				}
				if (this.$data.formUsername.length < 12) {
					await postForm({username: this.$data.formUsername}, this.$props.user.login)
				}
				if (this.$data.formAvatar) {
					let buf = await toBuffer(this.$data.formAvatar)
					let ok = await check(buf)
					if (!ok) {
						throw new Error("T'as cru quoi (feur)")
					}
					await encode(this.$data.formAvatar).then(async av => {
						await postForm({avatar: av}, this.$props.user.login)
					})
					this.$data.formAvatar = undefined
				}
				if (this.$data.formBanner) {
					let buf = await toBuffer(this.$data.formAvatar)
					let ok = await check(buf)
					if (!ok) {
						throw new Error("T'as cru quoi (feur)")
					}
					await encode(this.$data.formBanner).then(async ban => {
						await postForm({banner: ban}, this.$props.user.login)
					})
					this.$data.formBanner = undefined
				}
				EventBus.$emit("userChanged", "")
				this.showSnack("Profile updated", "green")
			} catch (e) {
				this.showSnack("Failed to update profile", "red")
			}
		},
		async changeFa(enabled: boolean) {
			this.$data.reload = true
			if (enabled)
				this.showSnack("2FA enabled", "green")
			else
				this.showSnack("2FA disabled", "green")
			this.$props.user.fa = enabled
			this.$data.faButton = false
			setTimeout(() => {
				this.$data.reload = false
			}, 500)
		}
	},
	mounted() {
		this.$data.formUsername = this.$props.user.username
	}
})
export default class ProfileSettingsForm extends Vue {
}

</script>

<style scoped>

</style>
