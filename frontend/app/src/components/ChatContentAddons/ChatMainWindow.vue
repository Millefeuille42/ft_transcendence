<template>
	<v-container fill-height class="align-content-end ">
		<v-container id="chatWin" class="overflow-y-auto mt-5 pb-0 pt-0" style="max-height: 90%" height="50%">
			<v-list two-line>
				<template v-for="message in messages">
					<ChatMessage
						:objKey="message.user + message.message"
						:sender="message.user"
						:avatar="message.avatar"
						:content="message.message"
					/>
					<v-divider
						:key="`divider-${message.user + message.message}`"
						inset
					></v-divider>
				</template>
			</v-list>
		</v-container>
		<v-sheet color="" width="100%" class="mt-4 d-flex flex-row justify-space-around">
			<v-sheet width="70%" color="" class="d-flex flex-column justify-center">
				<v-text-field
					class="justify-end"
					label="Message"
					v-model="text"
				></v-text-field>
			</v-sheet>
			<v-btn @click="handleSend" width="10%" class="my-auto"> Send </v-btn>
		</v-sheet>
	</v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ChatMessage from "@/components/ChatContentAddons/ChatMessage.vue";
import {EventBus} from "@/main";

interface messageData {
	message: String,
	user: String,
	avatar: String,
}

@Component({
	components: {ChatMessage},
	data: () => ({
		messages: [] as messageData[],
		cards: ['Today', 'Yesterday'],
		drawer: null,
		links: [
			['mdi-inbox-arrow-down', 'Inbox'],
			['mdi-send', 'Send'],
			['mdi-delete', 'Trash'],
			['mdi-alert-octagon', 'Spam'],
		],
		text: ""
	}),
	methods: {
		handleSend() {
			this.$emit("messageSend", this.$data.text)
		}
	},
	mounted() {
		EventBus.$on('newMessage', (message: messageData) => {
			this.$data.messages.push(message)
		})
	},
	updated() {
		let elem = document.getElementById('chatWin');
		if (elem === null)
			return
		elem.scrollTop = elem.scrollHeight;
	}
})
export default class ChatMainWindow extends Vue {
}
</script>

<style scoped>

</style>
