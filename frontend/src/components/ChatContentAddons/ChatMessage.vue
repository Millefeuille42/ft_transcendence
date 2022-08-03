<template>
	<v-list-item :key=objKey color="grey" style="width: 100%">
		<v-list-item-avatar color="grey darken-1">
			<v-img :src=avatar > </v-img>
		</v-list-item-avatar>
		<v-list-item-content color="grey">
			<v-list-item-title>{{ sender }}</v-list-item-title>
			<v-list-item-subtitle class="text-wrap">
				{{ content }}
			</v-list-item-subtitle>
		</v-list-item-content>
	</v-list-item>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({
	props: {
		objKey: Number,
		sender: String,
		content: String,
		avatar: String
	},
})
export default class ChatMessage extends Vue {
}
</script>

<style scoped>

</style>
