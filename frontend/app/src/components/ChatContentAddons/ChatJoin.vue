<template>
	<v-sheet color="transparent" width="100%" class="d-flex mt-5">
		<v-btn @click="showJoin = true; noExist = false" class="mr-auto ml-auto">Join</v-btn>
		<v-dialog persistent max-width="300px" dark v-model="showJoin">
			<v-sheet width="100%" height="100%" class="d-flex flex-column justify-center align-center">
				<v-sheet v-if="noExist || joinDisplayPasswordPrompt" width="100%" class="text-center mt-4 mb-5">
					{{ joinDisplayPasswordPrompt ? "This channel needs a password" : "This channel doesn't exist, create it?" }}
				</v-sheet>
				<v-sheet v-if="joinDisplayPasswordPrompt" width="80%" class="d-flex flex-row align-center">
					<v-text-field
						:style="'width: 50%;'"
						label="Password"
						v-model="joinPasswordPrompt"
					></v-text-field>
				</v-sheet>
				<v-text-field v-if="!noExist && !joinDisplayPasswordPrompt"
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
							:style="'width: 50%;'"
							:disabled="!createHasPassword"
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
		resetFields() {
			this.$data.showJoin = false
			setTimeout(() => {
				this.$data.joinPrompt = ""
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
		handleJoin() {
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
					if (data.pass && this.$data.joinPasswordPrompt === "") {
						if (this.$data.joinPasswordPrompt === "") {
							this.$data.joinDisplayPasswordPrompt = true
							return
						}
						if (this.$data.joinPasswordPrompt === "") {
							this.showSnack("Invalid password", "red")
							return
						}
					}
					// TODO Join Channel
					console.log("AllGOUD")
				})
				.catch((e) => {
					if (e.response && e.response.status == 404) {
						this.$data.noExist = true
						return
					}
					if (e.response) {
						if (e.response.status >= 401 && e.response.status <= 404) {
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
						if (e.response.status >= 401 && e.response.status <= 403) {
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
