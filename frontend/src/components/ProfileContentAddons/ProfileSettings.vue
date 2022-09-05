<template>
	<v-sheet class="d-flex flex-column justify-center" width="100%"
			 :height="$vuetify.breakpoint.mobile ? '100%' : '90%'">
		<ProfileSettingsForm :loaded="loaded" :user="user"/>
		<v-sheet class="mt-auto mr-auto ml-auto d-flex flex-row justify-space-around"
				 :width="$vuetify.breakpoint.mobile ? '100%' : '70%'">
			<v-btn @click="showBlocked = true"
				   :fab="$vuetify.breakpoint.mobile"
			> {{ $vuetify.breakpoint.mobile ? '' : 'See blocked users' }}
				<v-icon v-if="$vuetify.breakpoint.mobile" >
					mdi-account-cancel
				</v-icon>
			</v-btn>

			<v-btn @click="handleDisconnect"
				   :fab="$vuetify.breakpoint.mobile"

			> {{ $vuetify.breakpoint.mobile ? '' : 'Disconnect' }}
				<v-icon v-if="$vuetify.breakpoint.mobile" >
					mdi-account-off
				</v-icon>
			</v-btn>

			<v-btn @click="sure = true" color="red"
				   :fab="$vuetify.breakpoint.mobile"

			> {{ $vuetify.breakpoint.mobile ? '' : 'Delete Account' }}
				<v-icon v-if="$vuetify.breakpoint.mobile" >
					mdi-account-remove
				</v-icon>
			</v-btn>
		</v-sheet>
		<v-dialog v-model="showBlocked" width="20%" scrollable dark>
				<ProfileSettingsBlockedList v-if="showBlocked" :user="user"/>
		</v-dialog>
		<v-dialog v-model="sure" width="20%" dark>
			<ProfileSettingsTrollDialog @no="sure = false" @yes="handleDeletion"/>
		</v-dialog>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ProfileSettingsForm from "@/components/ProfileContentAddons/ProfileSettingsAddons/ProfileSettingsForm.vue";
import ProfileSettingsBlockedList
	from "@/components/ProfileContentAddons/ProfileSettingsAddons/ProfileSettingsBlockedList.vue";
import ProfileSettingsTrollDialog
	from "@/components/ProfileContentAddons/ProfileSettingsAddons/ProfileSettingsTrollDialog.vue";

@Component({
	components: {ProfileSettingsTrollDialog, ProfileSettingsBlockedList, ProfileSettingsForm},
	//TODO send user data to api
	data: () => ({
		snackShow: false,
		snackText: "",
		snackColor: "green",
		showBlocked: false,
		sure: false,
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
		handleDisconnect() {
			this.$cookies.remove("Session")
			window.location.hash = ""
			window.location.href = "/"
		},
		handleDeletion() {
			// TODO add deletion when endpoint is ready
			this.$data.sure = false
			this.handleDisconnect()
		}
	},
	mounted() {
		this.$data.formUsername = this.$props.user.username
		this.$data.formProfilePic = this.$props.user.avatar
		this.$data.formBannerPic = this.$props.user.banner
	}
})
export default class ProfileSettings extends Vue {
}

</script>

<style scoped>

</style>
