<template>
	<v-sheet
		id="scrolling-techniques-3"
		class="overflow-y-auto card-container"
	>
		<ContentSheetCard
			Title="La il s'est passé un truc"
			Subtitle="eh ouais"
			Text="Blah blah"
		/>
		<ContentSheetCard
			Title="Une pomme de terre sauvage"
			Subtitle="eh ouais"
			Text="Blah blah"
		/>
		<ContentSheetCard
			Title="Une pomme de terre sauvage"
			Subtitle="eh ouais"
			Text="Blah blah"
		/>
		<ContentSheetCard
			Title="Une pomme de terre sauvage"
			Subtitle="eh ouais"
			Text="Blah blah"
		/>
		<ContentSheetCard
			Title="Une pomme de terre sauvage"
			Subtitle="eh ouais"
			Text="Blah blah"
		/>
		<ContentSheetCard
			Title="Une pomme de terre sauvage"
			Subtitle="eh ouais"
			Text="Blah blah"
		/>

		<ContentSheetCard
			Title="Une pomme de terre sauvage"
			Subtitle="eh ouais"
			Text="Blah blah"
		/>

		<ContentSheetCard
			Title="Une pomme de terre sauvage"
			Subtitle="eh ouais"
			Text="Blah blah"
		/>

		<ContentSheetCard
			Title="Une pomme de terre sauvage"
			Subtitle="eh ouais"
			Text="Blah blah"
		/>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ContentSheetCard from "@/components/ContentSheetCard.vue";

@Component({
	components: {ContentSheetCard}
})
export default class ContentSheet extends Vue {}
</script>

<style scoped>
	.card-container {
		max-height: 74.5%;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.card-container::-webkit-scrollbar {
		width: 0;
		height: 0;
	}
</style>
