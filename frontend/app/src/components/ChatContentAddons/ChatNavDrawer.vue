<template>
	<v-navigation-drawer v-model="drawer" height="100%" style="border-radius: 20px"
						 class="d-flex flex-column"
						 permanent>
		<v-container>
			<SkeletonChatProfileCard v-if="!loaded"></SkeletonChatProfileCard>
			<ChatProfileCard v-if="loaded" :user=user></ChatProfileCard>
		</v-container>
		<v-divider></v-divider>
		<v-treeview :items="items" hoverable v-model="tree" open-on-click item-key="name" class="text-left">
		</v-treeview>
		<v-divider></v-divider>
		<v-sheet color="transparent" width="100%" class="d-flex mt-5">
			<v-btn @click="showJoin = true; noExist = false" class="mr-auto ml-auto">Join</v-btn>
		</v-sheet>
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
					<v-btn width="30%" @click="resetFields">No</v-btn>
				</v-sheet>
			</v-sheet>
		</v-dialog>
	</v-navigation-drawer>
</template>

<script lang="ts">
// TODO Attendre que Elo fasse marcher le "My channels" pour tester le join
import {Component, Vue} from "vue-property-decorator";
import ChatProfileCard from "@/components/ChatContentAddons/ChatProfileCard.vue";
import SkeletonChatProfileCard from "@/components/SkeletonComponents/SkeletonChatProfileCard.vue";
import {createChannel, getChannel, getChannelsOfUser, getDMsOfUser, RedirectToFTAuth} from "@/queries";
import {channelData, getChannelResp, getDmResp} from "@/queriesData";
import {EventBus} from "@/main";

@Component({
	components: {SkeletonChatProfileCard, ChatProfileCard},
	props: {
		user: Object,
		loaded: Boolean,
	},
	data: () => ({
		drawer: null,
		showJoin: false,
		joinPrompt: "",
		joinDisplayPasswordPrompt: false,
		joinHasPassword: false,
		joinPasswordPrompt: "",
		noExist: false,
		createPublic: true,
		createHasPassword: false,
		createPasswordPrompt: "",
		tree: [],
		items: [
			{
				id: 'chan',
				name: "Channels",
				children: []
			},
			{
				id: 'dm',
				name: "Private Messages",
				children: []
			}
		]
	}),
	methods: {
		resetFields() {
			this.$data.showJoin = false
			setTimeout(() => {
				this.$data.joinPrompt = ""
				this.$data.joinDisplayPasswordPrompt = false
				this.$data.joinHasPassword = false
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
			console.log("Join")
			if (this.$data.joinPrompt === "") {
				this.showSnack("Invalid channel name", "red")
				return
			}
			let chan = this.$data.items[0].children.find((c: channelData) => {
				return c.name === this.$data.joinPrompt
			})
			if (chan !== undefined) {
				this.showSnack("You already joined this channel", "red")
				return
			}
			getChannel(this.$data.joinPrompt)
				.then((data: channelData) => {
					if (!data.public) {
						this.showSnack("This channel is private", "red")
						return
					}
					if (data.hasPassword && !this.$data.joinHasPassword) {
						if (!this.$data.joinHasPassword) {
							this.$data.joinDisplayPasswordPrompt = true
							return
						}
						if (this.$data.joinPasswordPrompt === "") {
							this.showSnack("Invalid password", "red")
							return
						}
						// TODO join channel
					}
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
			console.log("Create")
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
						if (e.response.status == "409") {
							this.showSnack("This channel already exists", "red")
							return
						}
						if (e.response.status >= 401 && e.response.status <= 404) {
							this.$cookies.remove("Session")
							RedirectToFTAuth()
							return
						}
					}
					EventBus.$emit("down", "")
			})
		},
		loadChannels() {
			getChannelsOfUser(this.$props.user.login)
				.then((data: getChannelResp) => {
					if (data.thereIsChannel) {
						data.channels.forEach((chan: channelData) => {
							chan.id= "chan-" + chan.id
							this.$data.items[0].children.push(chan)
						})
					}
				})
				.catch((e) => {
					if (e.response) {
						if (e.response.status >= 401 && e.response.status <= 403) {
							this.$cookies.remove("Session")
							RedirectToFTAuth()
							return
						}
            if (e.response.status == 404) {
              return;
            }
					}
					EventBus.$emit("down", "")
				})
		},

		loadDMs() {
			getDMsOfUser(this.$props.user.login)
				.then((data: getDmResp) => {
					if (data.thereIsDm) {
						// TODO load dm data
					}
				})
				.catch((e) => {
					if (e.response) {
					  	if (e.response.status >= 401 && e.response.status <= 403) {
					  		this.$cookies.remove("Session")
					  		RedirectToFTAuth()
					  		return
					  	}
              if (e.response.status == 404) {
                return;
              }
					  EventBus.$emit("down", "")
				  }
        })
		}
	},
	mounted() {
		this.loadChannels()
		this.loadDMs()
	}
})
export default class ChatNavDrawer extends Vue {
}
</script>

<style scoped>

</style>
