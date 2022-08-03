<template>
	<v-sheet style="width: 100%; height: 100%" class="d-flex justify-space-between" color="">
		<v-sheet width="33%" height="100%" class="overflow-y-auto">
			<v-skeleton-loader boilerplate type="heading"></v-skeleton-loader>
			<v-skeleton-loader boilerplate type="list-item-avatar-two-line"></v-skeleton-loader>
			<v-skeleton-loader boilerplate type="list-item-avatar-two-line"></v-skeleton-loader>
			<v-skeleton-loader boilerplate type="list-item-avatar-two-line"></v-skeleton-loader>
			<v-skeleton-loader boilerplate type="list-item-avatar-two-line"></v-skeleton-loader>
			<v-skeleton-loader boilerplate type="list-item-avatar-two-line"></v-skeleton-loader>
			<v-skeleton-loader boilerplate type="list-item-avatar-two-line"></v-skeleton-loader>
			<v-skeleton-loader boilerplate type="list-item-avatar-two-line"></v-skeleton-loader>
			<v-skeleton-loader boilerplate type="list-item-avatar-two-line"></v-skeleton-loader>
			<v-skeleton-loader boilerplate type="list-item-avatar-two-line"></v-skeleton-loader>
			<v-skeleton-loader boilerplate type="list-item-avatar-two-line"></v-skeleton-loader>
		</v-sheet>
		<v-sheet width="63%" height="100%">
			<ProfileCard :user="user" height="100%"></ProfileCard>
		</v-sheet>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ProfileCard from "@/components/ProfileContentAddons/ProfileCard.vue";

@Component({
	components: {ProfileCard},
	props: {
		user: Object
	}
})
export default class ProfileFriends extends Vue {}
</script>

<style scoped>

</style>
