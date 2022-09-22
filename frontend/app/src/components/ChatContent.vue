<template>
	<v-container fill-height class="align-content-start text-left">
		<v-app-bar
			dark
		>
			<v-app-bar-nav-icon @click.stop="showDrawer = true"></v-app-bar-nav-icon>
		</v-app-bar>
		<!-- suppress HtmlDeprecatedAttribute -->
		<v-img color="transparent" height="0%" :src=user.banner align="center"></v-img>
		<v-row style="height: 100%">
				<v-navigation-drawer v-model="showDrawer"
									 app
									 temporary
									 class="d-flex flex-column"
				>
					<ChatNavDrawer @changedChannel="handleChange" v-if="!rel" :showDrawer="showDrawer" :loaded="loaded" :user=user></ChatNavDrawer>
				</v-navigation-drawer>
			<v-col style="height: 100%">
				<ChatMainWindow v-if="selected.name !== undefined && !relMain" :login="user.login" :hasCurrent="isAuth" :current="selected" @messageSend="sendMessage"></ChatMainWindow>
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
import {channelData} from "@/queriesData";

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
	watch: {
		group () {
			this.$props.showDrawer = false
		},
	},
	data: () => ({
		group: null,
		showDrawer: false,
		selected: {} as channelData,
		snackShow: false,
		snackText: "",
		snackColor: "green",
		rel: false,
		relMain: false,
		isConnected: false,
		isAuth: false,
		socketMessage: ''
	}),
	sockets: {
		connect() {
			this.$data.isConnected = true
		},
		disconnect() {
			this.$data.isConnected = false
		},

		auth(data) {
			console.log(data)
			setTimeout(() => {
				this.$data.isAuth = data
			}, 200)
		},

		message(data) {
			if (data === null)
				return
			EventBus.$emit("newMessage", data)
		},
		error() {
		}
	},
	methods: {
		handleChange(chan: channelData) {
			this.$data.relMain = true
			setTimeout(() => {
				this.$data.relMain = false
			}, 200)
			this.$data.showDrawer = false
			this.$data.selected = chan
		},
		showSnack(text: string, color: string) {
			this.$data.snackColor = color
			this.$data.snackText = text
			this.$data.snackShow = true
		},
		sendMessage(text: string) {
			let data: messageData = {message: text, channel: this.$data.selected.name}
			this.$socket.emit('message', data)
		}
	},
	mounted() {
		setTimeout(() => {
			this.$socket.emit('auth', {
				token: this.$cookies.get("Session"),
				login: this.$cookies.get("Login")
			})
		},1000)
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
