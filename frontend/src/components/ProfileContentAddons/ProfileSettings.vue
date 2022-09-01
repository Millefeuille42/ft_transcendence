<template>
	<v-sheet class="d-flex flex-column justify-center" width="100%" height="90%">
		<ProfileSettingsForm :loaded="loaded" :user="user"/>
		<v-sheet class="mt-auto mr-auto ml-4">
			<v-btn @click="showBlocked = true"> See blocked users </v-btn>
		</v-sheet>
		<v-dialog v-model="showBlocked" width="20%" scrollable dark>
				<ProfileSettingsBlockedList v-if="showBlocked" :user="user"/>
		</v-dialog>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ProfileSettingsForm from "@/components/ProfileContentAddons/ProfileSettingsAddons/ProfileSettingsForm.vue";
import ProfileSettingsBlockedList
	from "@/components/ProfileContentAddons/ProfileSettingsAddons/ProfileSettingsBlockedList.vue";

@Component({
	components: {ProfileSettingsBlockedList, ProfileSettingsForm},
	//TODO send user data to api
	data: () => ({
		snackShow: false,
		snackText: "",
		snackColor: "green",
		showBlocked: false
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
