<template>
	<v-container fill-height class="d-flex flex-column align-center justify-center">
		<ProfileCard :user=user v-if="loaded" height="30%"></ProfileCard>
		<SkeletonProfileCard :user=user v-if="!loaded" height="30%"></SkeletonProfileCard>
		<ProfileDataContainer class="mb-auto mt-8">
			<component v-if="loaded" :is="tabs[bottomTab]" :user=user height="100%"></component>
			<SkeletonProfileComponent v-if="!loaded" height="100%"/>
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
import SkeletonProfileCard from "@/components/SkeletonComponents/SkeletonProfileCard.vue";
import SkeletonProfileComponent from "@/components/SkeletonComponents/SkeletonProfileComponent.vue";

@Component({
	components: {
		SkeletonProfileComponent,
		ProfileBottomDrawer, ProfileDataContainer, ProfileCustomize, ProfileForm, ProfileFriends, ProfileCard, SkeletonProfileCard},
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
		user: Object,
		loaded: Boolean
	},
	created() {
		EventBus.$on("bottomTabChanged", (id: number) => {
			this.$data.bottomTab = id
		})
	}
	// TODO Add stats
})
export default class ProfileContent extends Vue {
}
</script>

<style scoped>

</style>
