<template>
	<v-sheet color="transparent" height="100%" class="align-content-end " elevation="0">
		<v-sheet id="chatWin" class="overflow-y-auto mt-5 pb-0 pt-0" height="65%">
			<v-list two-line class="">
				<template v-if="showMessages" >
					<template v-for="message in messages">
						<ChatMessage
							:owner="owner === message.login"
							:objKey="message.id"
							:sender="message.username"
							:avatar="message.avatar"
							:content="message.message"
						/>
						<v-divider
							:key="`divider-${message.id}`"
							inset
						></v-divider>
					</template>
				</template>
				<v-progress-circular v-else
									 :indeterminate="loadStatus === 0" color="white" :value="loadStatus"/>
			</v-list>
		</v-sheet>
		<v-sheet color=""  width="100%" class="mt-4 d-flex flex-row justify-space-around">
			<v-sheet width="70%" color="" class="d-flex flex-column justify-center">
				<v-text-field
					:disabled="!hasCurrent"
					class="justify-end"
					:counter="140"
					:label="current.name"
					v-model="text"
				></v-text-field>
			</v-sheet>
			<v-btn @click="handleSend" width="10%" class="my-auto"> Send </v-btn>
		</v-sheet>
		<v-sheet width="100%" color="transparent" class="d-flex flex-row justify-center">
			<ChatUsersDrawer v-if="!current.isDm" :login="login" :isAdmin="isAdmin" :isOwner="owner === login" :users="users" :channel="current.name" :usersLoaded="usersLoaded" />
			<ChatPrivacyDialog :owner="owner === login" :login="login" :currentChan="current.name"/>
		</v-sheet>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ChatMessage from "@/components/ChatContentAddons/ChatMessage.vue";
import {EventBus} from "@/main";
import {channelData, messageDataIn, smolUserData, userDataIn} from "@/queriesData";
import {getChannel, getDm, getUserByUser, getUserData} from "@/queries";
import ChatProfileCardLoader from "@/components/ChatContentAddons/ChatProfileCardLoader.vue";
import ChatUsersDrawer from "@/components/ChatContentAddons/ChatUsersDrawer.vue";
import ChatPrivacyDialog from "@/components/ChatContentAddons/ChatPrivacyDialog.vue";

interface messageData {
	id: string,
	login: string
	message: string,
	username: string,
	avatar: string,
	channel: string,
	createdAt: Date
}

@Component({
	components: {ChatPrivacyDialog, ChatUsersDrawer, ChatProfileCardLoader, ChatMessage},
	props: {
		login: String,
		current: Object,
		hasCurrent: Boolean
	},
	data: () => ({
		owner: "",
		isAdmin: false,
		users: [] as userDataIn[],
		messages: [] as messageData[],
		knownUsers: [] as userDataIn[],
		showMessages: false,
		usersLoaded: false,
		loadCount: 0,
		loadStatus: 0,
		text: ""
	}),
	methods: {
		addMessage(uData: smolUserData, message: messageDataIn, length: number) {
			if (!uData.isBlocked) {
				this.$data.messages.push({
					login: message.userLogin,
					message: message.content,
					createdAt: new Date(message.createAd),
					avatar: uData.avatar,
					username: uData.username,
					id: message.id.toString()
				})
			}
			this.$data.loadCount++
			this.$data.loadStatus = (this.$data.loadCount / length) * 100
			if (this.$data.loadCount >= length) {
				this.$data.messages.sort((a: messageData, b: messageData) => {
					return a.createdAt > b.createdAt ? 1 : -1
				})
				this.$data.showMessages = true
			}
		},
		async getMessages(noMessage: boolean = false) {
			let dummy = this.$props.current.isDm ? this.$props.current.name : ""
			let fst = this.$props.current.isDm ? this.$props.login : this.$props.current.name
			let query = this.$props.current.isDm ? getDm : getChannel
			query(fst, dummy)
				.then(async (data: channelData) => {
					this.$data.owner = data.owner
					this.$data.users = data.users
					this.$data.usersLoaded = true
					let meADM = data.admins?.find((a: any) => {
						return a.login === this.$props.login
					})
					if (meADM !== undefined) {
						this.$data.isAdmin = true
					}
					if (noMessage)
						return
					if (data.messages.length > 0) {
						for (const message of data.messages) {
							if (this.$data.knownUsers.length > 0) {
								let user: userDataIn | undefined = this.$data.knownUsers.find((a:userDataIn) => {
									return a.login === message.userLogin
								})
								if (user !== undefined) {
									this.addMessage(user, message, data.messages.length)
									continue
								}
							}
							await getUserByUser(this.$props.login, message.userLogin).then((uData: smolUserData) => {
								uData.login = message.userLogin
								this.$data.knownUsers.push(uData)
								this.addMessage(uData, message, data.messages.length)
							}).catch((e) => {
								if (e.response) {
									EventBus.$emit("chatSnack", e.response.data.message, "red")
								}
							})
						}
					} else {
						this.$data.showMessages = true
					}
				}).catch((e) => {
				if (e.response) {
					EventBus.$emit("chatSnack", e.response.data.message, "red")
				}
			})
		},
		handleSend() {
			if (this.$data.text.length <= 0 || this.$data.text.length > 140) {
				EventBus.$emit("chatSnack", "Invalid message", "red")
				return
			}
			this.$emit("messageSend", this.$data.text)
			this.$data.text  = ""
		}
	},
	mounted() {
		this.$data.usersLoaded = false
		this.getMessages()
		this.$socket.emit('auth', {
			token: this.$cookies.get("Session"),
			login: this.$cookies.get("Login")
		})
		EventBus.$on('newMessage', (message: messageData) => {
			if (message.channel !== this.$props.current.name)
				return
			message.id = message.message + message.login
			this.$data.messages.push(message)
		})
		EventBus.$on('newDm', (dm: {from: string, to: string, message: string}) => {
			if (dm.from !== this.$props.current.name && dm.to !== this.$props.current.name) {
				return
			}
			getUserByUser(this.$props.login, dm.from).then((uData: smolUserData) => {
				if (uData.isBlocked) {
					return
				}
				let message: messageData = {} as messageData
				message.id = dm.message + dm.from
				message.message = dm.message
				message.login = dm.from
				message.avatar = uData.avatar
				message.username = uData.username
				message.channel = dm.from
				this.$data.messages.push(message)
			}).catch((e) => {
				if (e.response) {
					EventBus.$emit("chatSnack", e.response.data.message, "red")
				}
			})
		})
		EventBus.$on('chanUpdateUserList', () => {
			this.getMessages(true)
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
