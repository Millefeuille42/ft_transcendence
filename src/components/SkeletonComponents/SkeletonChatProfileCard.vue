<template>
	<v-sheet class="mx-auto" max-width="100%" align="center" color="transparent">
		<v-row class="pa-5">
			<v-col cols="12">
				<v-skeleton-loader type="avatar"></v-skeleton-loader>
			</v-col>
			<v-col class="py-0">
				<v-list-item dark>
					<v-list-item-content>
						<v-skeleton-loader type="list-item-two-lines, sentences" ></v-skeleton-loader>
					</v-list-item-content>
				</v-list-item>
			</v-col>
		</v-row>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({})
export default class SkeletonChatProfileCard extends Vue {
}
</script>

<style scoped>

</style>
