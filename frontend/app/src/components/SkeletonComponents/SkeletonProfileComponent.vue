<template>
	<v-sheet style="min-width: 100%; height: 100%" class="d-flex justify-space-between" color="">
		<v-sheet width="100%" height="100%" class="overflow-y-auto">
			<v-skeleton-loader class="mb-10" type="heading"></v-skeleton-loader>
			<v-skeleton-loader class="mb-4" type="paragraph"></v-skeleton-loader>
			<v-skeleton-loader class="mb-4" type="paragraph"></v-skeleton-loader>
			<v-skeleton-loader class="mb-4" type="text@3"></v-skeleton-loader>
		</v-sheet>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import SkeletonProfileCard from "@/components/SkeletonComponents/SkeletonProfileCard.vue";

@Component({
	components: {SkeletonProfileCard}
})
export default class SkeletonProfileComponent extends Vue {
}
</script>

<style scoped>

</style>
