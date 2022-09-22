<template>
	<v-container fill-height class="align-content-start text-left">
		<!--suppress HtmlDeprecatedAttribute -->
		<v-img color="transparent" height="0%" :src=user.banner align="center"></v-img>
		<v-row style="height: 100%">
			<v-col cols="3" style="height: 100%">
				<ChatNavDrawer v-if="!rel" :loaded="loaded" :user=user></ChatNavDrawer>
			</v-col>
			<v-col style="height: 100%">
				<ChatMainWindow @messageSend="sendMessage" v-if="loaded"></ChatMainWindow>
				<SkeletonChatMainWindow v-if="!loaded"></SkeletonChatMainWindow>
			</v-col>
		</v-row>
		<v-snackbar app absolute v-model="snackShow" :color="snackColor" timeout="2000" > {{ snackText }} </v-snackbar>
	</v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ChatNavDrawer from "@/components/ChatContentAddons/ChatNavDrawer.vue";
import ChatMainWindow from "@/components/ChatContentAddons/ChatMainWindow.vue";
import ProfileContent from "@/components/ProfileContent.vue";
import ProfileCard from "@/components/ProfileContentAddons/ProfileCard.vue";
import SkeletonChatMainWindow from "@/components/SkeletonComponents/SkeletonChatMainWindow.vue";
import {EventBus} from "@/main";

interface messageData {
	message: String,
	user: String,
	avatar: String,
	channel: String
}

@Component({
	components: {SkeletonChatMainWindow, ProfileCard, ProfileContent, ChatMainWindow, ChatNavDrawer},
	props: {
		user: Object,
		loaded: Boolean,
		loggedIn: Boolean
	},
	data: () => ({
		snackShow: false,
		snackText: "",
		snackColor: "green",
		rel: false,
		isConnected: false,
		socketMessage: ''
	}),
	sockets: {
		connect() {
			console.log("Connected")
			this.$data.isConnected = true
		},

		disconnect() {
			console.log("Disconnected")
			this.$data.isConnected = false
		},

		chat(data) {
			if (data === null)
				return

			EventBus.$emit("newMessage", JSON.parse(data))
			console.log(data)
		},
		error() {
		}
	},
	methods: {
		showSnack(text: string, color: string) {
			this.$data.snackColor = color
			this.$data.snackText = text
			this.$data.snackShow = true
		},
		sendMessage(text: string) {
			let data: messageData = {message: text, user: this.$props.user.login, avatar: this.$props.user.avatar}
			this.$socket.emit('chat', JSON.stringify(data))
		}
	},
	mounted() {
		EventBus.$on("newChannel", () => {
			this.$data.rel = true
			setTimeout(() => {
				this.$data.rel = false
			}, 200)
		})
		EventBus.$on("chatSnack", (text: string, color: string) => {
			this.showSnack(text, color)
		})
	}
})
export default class ChatContent extends Vue {
}
</script>

<style scoped>

</style>
