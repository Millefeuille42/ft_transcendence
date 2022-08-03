<template>
	<v-container fill-height class="align-content-end ">
		<v-container class="overflow-y-auto mt-5 pb-0 pt-0" style="max-height: 90%" height="50%">
			<v-list two-line>
				<template v-for="n in 3">
					<ChatMessage
						:objKey=n
						:sender="'User ' + n"
						avatar="https://picsum.photos/200/200?random"
						content="Lorem ipsum dolor sidsanctio similique"
					/>
					<v-divider
						v-if="n !== 3"
						:key="`divider-${n}`"
						inset
					></v-divider>
				</template>
			</v-list>
		</v-container>
		<v-text-field class="mt-4 align-end"
				label="Message"
				outlined
				dense
			></v-text-field>
	</v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ChatMessage from "@/components/ChatContentAddons/ChatMessage.vue";

@Component({
	components: {ChatMessage},
	data: () => ({
		cards: ['Today', 'Yesterday'],
		drawer: null,
		links: [
			['mdi-inbox-arrow-down', 'Inbox'],
			['mdi-send', 'Send'],
			['mdi-delete', 'Trash'],
			['mdi-alert-octagon', 'Spam'],
		],
	}),
})
export default class ChatMainWindow extends Vue {
}
</script>

<style scoped>

</style>
