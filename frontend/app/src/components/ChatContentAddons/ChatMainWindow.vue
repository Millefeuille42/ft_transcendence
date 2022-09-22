<template>
	<v-sheet height="100%" class="align-content-end ">
		<v-sheet id="chatWin" class="overflow-y-auto mt-5 pb-0 pt-0" height="70%">
			<v-list two-line class="">
				<template v-if="showMessages" >
					<template v-for="message in messages">
						<ChatMessage
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
				<v-progress-linear v-else :indeterminate="loadStatus === 0" color="white" :value="loadStatus"/>
			</v-list>
		</v-sheet>
		<v-sheet color="" width="100%" class="mt-4 d-flex flex-row justify-space-around">
			<v-sheet width="70%" color="" class="d-flex flex-column justify-center">
				<v-text-field
					:disabled="!hasCurrent"
					class="justify-end"
					:label="current.name"
					v-model="text"
				></v-text-field>
			</v-sheet>
			<v-btn @click="handleSend" width="10%" class="my-auto"> Send </v-btn>
		</v-sheet>
		<v-sheet height="10%" width="100%" class="d-flex flex-row justify-space-around align-center">
			<v-btn>Users</v-btn>
			<v-navigation-drawer app permanent>
				<v-sheet color="transparent">
					<v-list-item v-for="user in current.users" color="red">
						<v-btn width="70%" height="20%" rounded :key="'btn-' + online.info.login"
							   @click="selectedUser = online; handleUserClick()"
							   class="d-flex justify-center mb-2 mt-2 pl-4" color="grey darken-4">
							<v-list-item-avatar>
								<v-img :src="user.avatar"/>
							</v-list-item-avatar>
							<v-list-item-content color="grey">
								<v-list-item-title class="text-left">{{ online.info.username }}</v-list-item-title>
							</v-list-item-content>
						</v-btn>
						<v-btn icon @click="handleBlock(online)" x-small>
							<v-icon v-if="!online.blockLoading">
								mdi-cancel
							</v-icon>
							<v-progress-circular v-else size="16" indeterminate></v-progress-circular>
						</v-btn>
						<v-btn icon @click="!online.friend ? handleAdd(online) : handleRemove(online)" x-small>
							<v-icon v-if="!online.friendLoading">
								{{ !online.friend ? 'mdi-account-plus' : 'mdi-close-circle' }}
							</v-icon>
							<v-progress-circular v-else size="16" indeterminate></v-progress-circular>
						</v-btn>
					</v-list-item>
				</v-sheet>
			</v-navigation-drawer>
		</v-sheet>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ChatMessage from "@/components/ChatContentAddons/ChatMessage.vue";
import {EventBus} from "@/main";
import {channelData, messageDataIn, userDataIn} from "@/queriesData";
import {getChannel, getUserData} from "@/queries";

interface messageData {
	id: string,
	login: string
	message: string,
	username: string,
	avatar: string,
	createdAt: Date
}

@Component({
	components: {ChatMessage},
	props: {
		current: Object,
		hasCurrent: Boolean
	},
	data: () => ({
		messages: [] as messageData[],
		knownUsers: [] as userDataIn[],
		showMessages: false,
		loadCount: 0,
		loadStatus: 0,
		text: ""
	}),
	methods: {
		addMessage(uData: userDataIn, message: messageDataIn, length: number) {
			this.$data.messages.push({
				login: message.userLogin,
				message: message.content,
				createdAt: new Date(message.createAd),
				avatar: uData.avatar,
				username: uData.username,
				id: message.id.toString()
			})
			this.$data.loadCount++
			this.$data.loadStatus = (this.$data.loadCount / length) * 100
			if (this.$data.loadCount >= length) {
				this.$data.messages.sort((a: messageData, b: messageData) => {
					return a.createdAt > b.createdAt ? 1 : -1
				})
				this.$data.showMessages = true
			}
		},
		async getMessages() {
			getChannel(this.$props.current.name)
				.then(async (data: channelData) => {
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
							await getUserData(message.userLogin).then((uData: userDataIn) => {
								this.$data.knownUsers.push(uData)
								this.addMessage(uData, message, data.messages.length)
							}).catch((e) => {
								console.log(e)
							})
						}
					} else {
						this.$data.showMessages = true
					}
				}).catch((e) => {
					console.log(e)
			})
		},
		handleSend() {
			this.$emit("messageSend", this.$data.text)
			this.$data.text  = ""
		}
	},
	mounted() {
		this.getMessages()
		this.$socket.emit('auth', {
			token: this.$cookies.get("Session"),
			login: this.$cookies.get("Login")
		})
		EventBus.$on('newMessage', (message: messageData) => {
			message.id = message.message + message.login
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
