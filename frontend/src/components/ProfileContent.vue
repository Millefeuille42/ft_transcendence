<template>
	<v-container fill-height class="d-flex flex-column align-center justify-center">
		<ProfileCard :user=user height="30%"></ProfileCard>
		<ProfileDataContainer class="mb-auto mt-8">
			<component :is="tabs[bottomTab]" :user=user height="100%"></component>
		</ProfileDataContainer>
		<ProfileBottomDrawer/>
	</v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ProfileCard from "@/components/ProfileContentAddons/ProfileCard.vue";
import ProfileForm from "@/components/ProfileContentAddons/ProfileForm.vue";
import ProfileFriends from "@/components/ProfileContentAddons/ProfileFriends.vue";
import ProfileCustomize from "@/components/ProfileContentAddons/ProfileCustomize.vue";
import ProfileDataContainer from "@/components/ProfileContentAddons/ProfileDataContainer.vue";
import ProfileBottomDrawer from "@/components/ProfileContentAddons/ProfileBottomDrawer.vue";
import {EventBus} from "@/main";

@Component({
	components: {ProfileBottomDrawer, ProfileDataContainer, ProfileCustomize, ProfileForm, ProfileFriends, ProfileCard},
	data: () => ({
		bottomTab: 0,
		tabs: [
			"ProfileForm",
			"ProfileCustomize",
			"ProfileFriends",
			"ProfileForm"
		]
	}),
	props: {
		user: Object
	},
	created() {
		EventBus.$on("bottomTabChanged", (id: number) => {
			this.$data.bottomTab = id
		})
	}
})
export default class ProfileContent extends Vue {
}
</script>

<style scoped>

</style>
