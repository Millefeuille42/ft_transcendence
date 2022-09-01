<template>
	<v-container fill-height class="d-flex flex-column align-center justify-center">
		<ProfileCard :user=user v-if="loaded" height="30%" mWidth="90%"></ProfileCard>
		<SkeletonProfileCard :user=user v-if="!loaded" height="30%"></SkeletonProfileCard>
		<ProfileDataContainer class="mb-auto mt-8">
			<component v-if="loaded && !reload" :is="tabs[bottomTab]" :user=user height="100%"></component>
			<SkeletonProfileComponent v-else height="100%"/>
		</ProfileDataContainer>
		<ProfileBottomDrawer/>
	</v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ProfileCard from "@/components/ProfileContentAddons/ProfileCard.vue";
import ProfileStats from "@/components/ProfileContentAddons/ProfileStats.vue";
import ProfileFriends from "@/components/ProfileContentAddons/ProfileFriends.vue";
import ProfileCustomize from "@/components/ProfileContentAddons/ProfileCustomize.vue";
import ProfileDataContainer from "@/components/ProfileContentAddons/ProfileDataContainer.vue";
import ProfileBottomDrawer from "@/components/ProfileContentAddons/ProfileBottomDrawer.vue";
import {EventBus} from "@/main";
import SkeletonProfileCard from "@/components/SkeletonComponents/SkeletonProfileCard.vue";
import SkeletonProfileComponent from "@/components/SkeletonComponents/SkeletonProfileComponent.vue";
import ProfileSettings from "@/components/ProfileContentAddons/ProfileSettings.vue";

@Component({
	components: {
		SkeletonProfileComponent,
		ProfileStats,
		ProfileBottomDrawer, ProfileDataContainer, ProfileCustomize, ProfileSettings, ProfileFriends, ProfileCard, SkeletonProfileCard},
	data: () => ({
		bottomTab: 0,
		tabs: [
			"ProfileStats",
			"ProfileCustomize",
			"ProfileFriends",
			"ProfileSettings"
		],
		reload: false
	}),
	props: {
		user: Object,
		loaded: Boolean
	},
	created() {
		EventBus.$on("bottomTabChanged", (id: number) => {
			this.$data.bottomTab = id
		})

		EventBus.$on("updateFriendList", () => {
			this.$data.reload = true
			setTimeout(() => {
				this.$data.reload = false
			}, 200)
		})
	}
	// TODO Add stats
})
export default class ProfileContent extends Vue {
}
</script>

<style scoped>

</style>
