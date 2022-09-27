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
				<ChatMainWindow v-if="selected.name !== undefined && !relMain" :login="user.login" :hasCurrent="auth" :current="selected" @messageSend="sendMessage"></ChatMainWindow>
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
import {channelData, smolUserData} from "@/queriesData";
import {getUserByUser} from "@/queries";

interface messageData {
	message: String,
	user: String,
	avatar: String,
	channel: String
}

@Component({
	components: {SkeletonChatMainWindow, ProfileCard, ProfileContent, ChatMainWindow, ChatNavDrawer},
	props: {
		auth: Boolean,
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
		isAuth: false,
		socketMessage: ''
	}),
	sockets: {
		message(data) {
			if (data === null)
				return
			getUserByUser(this.$props.user.login, data.login).then((uData: smolUserData) => {
				if (uData.isBlocked)
					return
				EventBus.$emit("newMessage", data)
			}).catch((e) => {
				if (e.response) {
					EventBus.$emit("chatSnack", e.response.data.message, "red")
				}
			})
		},
		userStatus() {
			EventBus.$emit("updateOnlineList")
			setTimeout(() => {
				EventBus.$emit("updateFriendStatus")
			}, 100)
		},
		dm(data: {from: string, to: string, message: string}) {
			EventBus.$emit("newDm", data)
		},
		auth(data) {
			EventBus.$emit('authSock', data);
		},
		multiInviteCode(data: {inviteCode: string, to: string}) {
			if (data.to === "") {
				this.showSnack("Invalid login", "red")
				return
			}
			this.$socket.emit('dm', {
				to: data.to,
				message: data.inviteCode,
			})
			EventBus.$emit('chanUpdate')
		},
		ban(data: {bannedBy: string, target: string, channel: string}) {
			if (data.target === this.$props.user.login) {
				this.handleChange({})
				this.showSnack("You have been banned from " + data.channel + " by " + data.bannedBy, "red")
				EventBus.$emit("chanUpdate")
			} else {
				EventBus.$emit("chanUpdateUserList")
			}
		},
		unban(data: {channel: string, login: string}) {
			if (data.login === this.$props.user.login) {
				this.showSnack("You are now unbanned from " + data.channel, "green")
			}
		},
		mute(data: {channel: string, mutedBy: string, target: string}) {
			if (data.target === this.$props.user.login) {
				this.showSnack("You have been muted from " + data.channel + " by " + data.mutedBy, "red")
				EventBus.$emit("chatMuted", true) // TODO disable prompt on channel
			}
		},
		unmute(data: {channel: string, login: string}) {
			if (data.login === this.$props.user.login) {
				this.showSnack("You are now un-muted from " + data.channel, "green")
				EventBus.$emit("chatMuted", false) // TODO disable prompt on channel
			}
		},
		join(data: {login: string}) {
			if (data.login === this.$props.user.login)
				EventBus.$emit("chanUpdate")
			else {
				EventBus.$emit("chanUpdateUserList")
			}
		},
		admin(data: {channel: string, login: string}) {
			if (data.login === this.$props.user.login) {
				EventBus.$emit("chanUpdateUserList")
				this.showSnack("You are now an admin of " + data.channel, "green")
			}
		},
		leave(data: {login: string}) {
			if (data.login === this.$props.user.login) {
				EventBus.$emit("chanUpdate")
				this.$data.selected = {}
			} else {
				EventBus.$emit("chanUpdateUserList")
			}

		},
		error(data: {status : number, message: string}) {
			if (data.message === undefined)
				return
			this.showSnack(data.message, "red")
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
			if (this.$data.selected.isDm) {
				let data = {message: text, to: this.$data.selected.name}
				this.$socket.emit('dm', data)
				return
			}

			let data = {message: text, channel: this.$data.selected.name}
			this.$socket.emit('message', data)
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
		EventBus.$on("chatBlocked", () => {
			this.handleChange(this.$data.selected)
		})
	}
})
export default class ChatContent extends Vue {
}
</script>

<style scoped>

</style>
