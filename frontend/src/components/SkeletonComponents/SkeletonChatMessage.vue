<template>
	<v-list-item :key=objKey color="grey" style="width: 100%">
		<v-skeleton-loader type="list-item-avatar" />
		<v-list-item-content color="grey">
			<v-skeleton-loader type="list-item, text" />
		</v-list-item-content>
	</v-list-item>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({
	props: {
		objKey: Number
	}
})
export default class SkeletonChatMessage extends Vue {
}
</script>

<style scoped>

</style>
