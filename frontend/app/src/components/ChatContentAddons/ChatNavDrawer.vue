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
		<v-dialog max-width="300px" dark v-model="showJoin">
			<v-sheet width="100%" height="100%" class="d-flex flex-column justify-center">
				<template v-if="!noExist">
					<v-text-field
						class="mr-auto ml-auto"
						:style="'width: 80%;'"
						v-model="joinPrompt"
						label="Enter channel name"
					></v-text-field>
					<v-btn @click="handleJoin">Join</v-btn>
				</template>
				<template v-else>
					<v-sheet class="text-center mb-5">
						This channel doesn't exist, create it?
					</v-sheet>
					<v-sheet width="100%" color="transparent" class="d-flex flex-row justify-space-around">
						<v-btn width="30%" @click="handleCreate">Yes</v-btn>
						<v-btn width="30%" @click="noExist = false;  showJoin = false">No</v-btn>
					</v-sheet>
				</template>
			</v-sheet>
		</v-dialog>
	</v-navigation-drawer>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ChatProfileCard from "@/components/ChatContentAddons/ChatProfileCard.vue";
import SkeletonChatProfileCard from "@/components/SkeletonComponents/SkeletonChatProfileCard.vue";
import {getChannel, getChannelsOfUser, getDMsOfUser} from "@/queries";
import {channelData, getChannelResp, getDmResp} from "@/queriesData";

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
		noExist: false,
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
		handleJoin() {
			if (this.$data.joinPrompt === "") {
				// TODO display snack
			}
			getChannel(this.$data.joinPrompt)
				.then((data: channelData) => {
					console.log(data)
				})
				.catch((e) => {
					if (e.response && e.response.status == 404) {
						this.$data.noExist = true
					}
				})
		},
		handleCreate() {

		},
		loadChannels() {
			getChannelsOfUser(this.$props.user.login)
				.then((data: getChannelResp) => {
					if (data.thereIsChannel) {

					}
				})
				.catch((e) => {
					console.log(e)
				})
		},

		loadDMs() {
			getDMsOfUser(this.$props.user.login)
				.then((data: getDmResp) => {
					if (data.thereIsDm) {

					}
				})
				.catch((e) => {
					console.log(e)
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
