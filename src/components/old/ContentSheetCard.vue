<template>
	<v-container style="margin-top: 1%">
		<v-card>
			<v-card-title v-if="Title !== ''">{{ Title }}</v-card-title>
			<v-card-subtitle v-if="Subtitle !== ''" >{{ Subtitle }}</v-card-subtitle>
			<v-card-text v-if="Text !== ''">
				{{ Text }}
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({
	props: {
		Title: String,
		Subtitle: String,
		Text: String,
	}
})
export default class ContentSheetCard extends Vue {
}
</script>

<style scoped>

</style>
