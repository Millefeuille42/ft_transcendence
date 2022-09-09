<template>
	<v-sheet style="width: 100%; height: 100%" class="d-flex justify-space-between" color="">
		<v-sheet width="33%" height="100%" class="overflow-y-auto">
			<v-skeleton-loader type="heading"></v-skeleton-loader>
			<v-skeleton-loader type="list-item-avatar-two-line"></v-skeleton-loader>
			<v-skeleton-loader type="list-item-avatar-two-line"></v-skeleton-loader>
			<v-skeleton-loader type="list-item-avatar-two-line"></v-skeleton-loader>
			<v-skeleton-loader type="list-item-avatar-two-line"></v-skeleton-loader>
			<v-skeleton-loader type="list-item-avatar-two-line"></v-skeleton-loader>
			<v-skeleton-loader type="list-item-avatar-two-line"></v-skeleton-loader>
			<v-skeleton-loader type="list-item-avatar-two-line"></v-skeleton-loader>
			<v-skeleton-loader type="list-item-avatar-two-line"></v-skeleton-loader>
			<v-skeleton-loader type="list-item-avatar-two-line"></v-skeleton-loader>
			<v-skeleton-loader type="list-item-avatar-two-line"></v-skeleton-loader>
		</v-sheet>
		<v-sheet width="63%" height="100%">
			<SkeletonProfileCard  height="100%"></SkeletonProfileCard>
		</v-sheet>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import SkeletonProfileCard from '@/components/SkeletonComponents/SkeletonProfileCard.vue'

@Component({
	components: {SkeletonProfileCard}
})
export default class SkeletonProfileFriends extends Vue {
}
</script>

<style scoped>

</style>
