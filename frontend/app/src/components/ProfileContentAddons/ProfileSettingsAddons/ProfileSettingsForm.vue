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
			<v-btn @click="faButton = true"
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
			<ProfileSettingsAuthSecurity @faStatus="changeFa" :user="user" />
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
			(v: string) => v.length <= 12 || 'Username must be less than 12 characters'
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
      let type
			const encode = (file: File) => new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = (() => {
          resolve(reader.result as string)
          const arr = (new Uint8Array(<any>reader.result)).subarray(0, 4)
          let header = ''
          for (let i = 0; i < arr.length; i++) {
            header += arr[i].toString(16)
          }
          switch (header) {
            case '8950e47':
              type = "image/png";
              break
            case 'ffd8ffe0':
            case 'ffd8ffe1':
            case 'ffd8ffe2':
            case 'ffd8ffe3':
            case 'ffd8ffe8':
              type = 'image/jpeg';
              break;
            default:
              type = 'unknown';
              break;
          }
        });
				reader.onerror = error => reject(error);
			})

			try {
        if (type === 'unknown')
          throw new Error("Wrong format for image")
				if (this.$data.formUsername.length <= 12) {
					await postForm({username: this.$data.formUsername}, this.$props.user.login)
				}
				if (this.$data.formAvatar) {
					await encode(this.$data.formAvatar).then(async av => {
						await postForm({avatar: av}, this.$props.user.login)
					})
					this.$data.formAvatar = undefined
				}
				if (this.$data.formBanner) {
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
