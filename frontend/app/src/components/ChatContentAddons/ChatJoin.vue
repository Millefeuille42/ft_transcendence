<template>
	<v-sheet color="transparent" width="100%" class="d-flex flex-column mt-5">
		<v-sheet width="100%" color="transparent" class="d-flex justify-center">
			<v-btn @click="showJoin = true; noExist = false" class="mx-2" >Join</v-btn>
			<v-btn @click="handleLeave" class="mx-2">Leave</v-btn>
		</v-sheet>
		<v-sheet width="100%" color="transparent" class="mt-4 d-flex justify-center">
			<v-btn  large icon @click="showDm = true">
				<v-icon>
					mdi-plus
				</v-icon>
			</v-btn>
			<v-btn  large icon @click="showInvite = true">
				<v-icon>
					mdi-mail
				</v-icon>
			</v-btn>
		</v-sheet>
		<v-dialog persistent max-width="300px" dark v-model="showInvite">
			<v-sheet width="100%" height="100%" class="d-flex flex-column justify-center align-center">
				<v-text-field class="mr-auto ml-auto"
							  :counter="12"
							  :style="'width: 80%;'"
							  v-model="invitePrompt"
							  label="Enter login"
				></v-text-field>
				<v-sheet width="100%" color="transparent" class="d-flex flex-row justify-space-around mb-4">
					<v-btn width="30%" @click="sendInvite">Yes</v-btn>
					<v-btn width="30%" @click="resetFields">Quit</v-btn>
				</v-sheet>
			</v-sheet>
		</v-dialog>
		<v-dialog persistent max-width="300px" dark v-model="showDm">
			<v-sheet width="100%" height="100%" class="d-flex flex-column justify-center align-center">
				<v-text-field class="mr-auto ml-auto"
							  :counter="12"
							  :style="'width: 80%;'"
							  v-model="dmPrompt"
							  label="Enter login"
				></v-text-field>
				<v-sheet width="100%" color="transparent" class="d-flex flex-row justify-space-around mb-4">
					<v-btn width="30%" @click="sendNewDm">Yes</v-btn>
					<v-btn width="30%" @click="resetFields">Quit</v-btn>
				</v-sheet>
			</v-sheet>
		</v-dialog>
		<v-dialog persistent max-width="300px" dark v-model="showJoin">
			<v-sheet width="100%" height="100%" class="d-flex flex-column justify-center align-center">
				<v-sheet v-if="noExist || joinDisplayPasswordPrompt" width="100%" class="text-center mt-4 mb-5">
					{{ joinDisplayPasswordPrompt ? "This channel needs a password" : "This channel doesn't exist, create it?" }}
				</v-sheet>
				<v-sheet v-if="joinDisplayPasswordPrompt" width="80%" class="d-flex flex-row align-center">
					<v-text-field
						:counter="12"
						:style="'width: 50%;'"
						label="Password"
						v-model="joinPasswordPrompt"
					></v-text-field>
				</v-sheet>
				<v-text-field v-if="!noExist && !joinDisplayPasswordPrompt"
							  :counter="12"
							  class="mr-auto ml-auto"
							  :style="'width: 80%;'"
							  v-model="joinPrompt"
							  label="Enter channel name"
				></v-text-field>
				<template v-if="noExist">
					<v-sheet width="80%" class="d-flex flex-row align-center">
						<v-checkbox
							v-model="createPublic"
							hide-details
							class="shrink mr-2 mt-0"
							label="Public"
						></v-checkbox>
					</v-sheet>
					<v-sheet width="80%" class="d-flex flex-row align-center">
						<v-checkbox
							v-model="createHasPassword"
							hide-details
							class="shrink mr-2 mt-0"
						></v-checkbox>
						<v-text-field
							:counter="12"
							:style="'width: 50%;'"
							:disabled="!createHasPassword || createPublic"
							label="Password"
							v-model="createPasswordPrompt"
						></v-text-field>
					</v-sheet>
				</template>
				<v-sheet width="100%" color="transparent" class="d-flex flex-row justify-space-around mb-4">
					<v-btn width="30%" @click="handleClick">Yes</v-btn>
					<v-btn width="30%" @click="resetFields">Quit</v-btn>
				</v-sheet>
			</v-sheet>
		</v-dialog>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {EventBus} from "@/main";
import {channelData} from "@/queriesData";
import {createChannel, getChannel, RedirectToFTAuth} from "@/queries";

@Component({
	data: () => ({
		showJoin: false,
		showDm: false,
		showInvite: false,
		invitePrompt: "",
		dmPrompt: "",
		joinPrompt: "",
		joinDisplayPasswordPrompt: false,
		joinPasswordPrompt: "",
		noExist: false,
		createPublic: true,
		createHasPassword: false,
		createPasswordPrompt: "",
	}),
	props: {
		items: [],
		user: Object
	},
	methods: {
		sendInvite() {
			if (this.$data.invitePrompt.length >= 12 || this.$data.invitePrompt.length <= 0) {
				this.showSnack("Invalid login", "red")
				return;
			}
			if (this.$data.invitePrompt === "") {
				this.showSnack("Invalid login", "red")
				return
			}
			this.$socket.emit('multiInviteCode', {
				to: this.$data.invitePrompt,
			})
			this.resetFields()
		},
		sendNewDm() {
			if (this.$data.dmPrompt.length >= 12 || this.$data.dmPrompt.length <= 0) {
				this.showSnack("Invalid login", "red")
				return;
			}
			if (this.$data.dmPrompt === "") {
				this.showSnack("Invalid login", "red")
				return
			}
			this.$socket.emit('dm', {
				to: this.$data.dmPrompt,
				message: "Hello there!",
			})
			this.resetFields()
			EventBus.$emit('chanUpdate')
		},
		resetFields() {
			this.$data.showJoin = false
			this.$data.showDm = false
			this.$data.showInvite = false
			setTimeout(() => {
				this.$data.invitePrompt = ""
				this.$data.joinPrompt = ""
				this.$data.dmPrompt = ""
				this.$data.joinDisplayPasswordPrompt = false
				this.$data.joinPasswordPrompt = ""
				this.$data.noExist = false
				this.$data.createPublic = true
				this.$data.createHasPassword = false
				this.$data.createPasswordPrompt = ""
			}, 200)
		},
		showSnack(text: string, color: string) {
			EventBus.$emit("chatSnack", text, color)
		},
		handleClick() {
			!this.$data.noExist ? this.handleJoin() : this.handleCreate()
		},
		handleLeave() {
			this.$emit('onLeave')
		},
		handleJoin() {
			if (this.$data.joinPrompt.length >= 12 || this.$data.joinPrompt.length <= 0) {
				this.showSnack("Invalid channel name", "red")
				return;
			}

			if (this.$data.joinPrompt === "") {
				this.showSnack("Invalid channel name", "red")
				return
			}
			let chan = this.$props.items[0].children.find((c: channelData) => {
				return c.name === this.$data.joinPrompt
			})
			if (chan !== undefined) {
				this.showSnack("You already joined this channel", "red")
				return
			}
			getChannel(this.$data.joinPrompt)
				.then((data: channelData) => {
					if (!data.public && !data.pass) {
						this.showSnack("This channel is private", "red")
						return
					}
					if (this.$data.joinPasswordPrompt === "" && this.$data.joinDisplayPasswordPrompt) {
						this.showSnack("Invalid password", "red")
						return
					}
					if (data.pass && this.$data.joinPasswordPrompt === "") {
						if (this.$data.joinPasswordPrompt === "") {
							this.$data.joinDisplayPasswordPrompt = true
							return
						}
					}
					this.$socket.emit('join', {
						channel: this.$data.joinPrompt,
						password: this.$data.joinPasswordPrompt
					})
					this.resetFields()
				})
				.catch((e) => {
					if (e.response && e.response.status == 404) {
						this.$data.noExist = true
						return
					}
					if (e.response) {
						if (e.response.status >= 400 && e.response.status <= 404) {
							this.$cookies.remove("Session")
							RedirectToFTAuth()
							return
						}
					}
					EventBus.$emit("down", "")
				})
		},
		handleCreate() {
			let pass = undefined
			if (this.$data.createHasPassword) {
				if (this.$data.createPasswordPrompt === "") {
					this.showSnack("Invalid password", "red")
					return
				}
				pass = this.$data.createPasswordPrompt
			} else {
				this.$data.createPasswordPrompt = ""
			}
			createChannel(this.$data.joinPrompt, this.$props.user.login, this.$data.createPublic, pass)
				.then(() => {
					EventBus.$emit("newChannel")
				})
				.catch((e) => {
					if (e.response) {
						if (e.response.status == 409) {
							this.showSnack("This channel already exists", "red")
							return
						}
						if (e.response.status == 400) {
							this.showSnack("Invalid channel name", "red")
							return;
						}
						if (e.response.status >= 400 && e.response.status <= 403) {
							this.$cookies.remove("Session")
							RedirectToFTAuth()
							return
						}
					}
					EventBus.$emit("down", "")
				})
		},
	}
})
export default class ChatJoin extends Vue {
}
</script>

<style scoped>

</style>
