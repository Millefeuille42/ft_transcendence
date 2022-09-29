<template>
	<v-sheet color="transparent">
		<v-container>
			<SkeletonChatProfileCard v-if="!loaded"></SkeletonChatProfileCard>
			<ChatProfileCard v-if="loaded" :user=user></ChatProfileCard>
		</v-container>
		<v-divider/>
		<v-sheet color="transparent">
			<template v-for="item in items">
				<v-sheet :key="item.id" color="transparent" width="100%"
						 class="d-flex flex-column justify-center align-center mt-2 mb-4">
					<v-sheet color="transparent" class="d-flex flex-column justify-center mb-2 align-center" width="100%">
						{{ item.name }}
					</v-sheet>
					<v-sheet color="transparent" width="100%" class="d-flex flex-column justify-center">
						<v-btn v-for="child in item.children" :key="child.id" color="transparent" class="my-1" elevation="0"
							   @click="handleClick(child)"
						> {{ child.name }} </v-btn>
					</v-sheet>
				</v-sheet>
				<v-divider/>
			</template>
		</v-sheet>
		<ChatJoin @onLeave="handleLeave" :items="items" :user="user"/>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ChatProfileCard from "@/components/ChatContentAddons/ChatProfileCard.vue";
import SkeletonChatProfileCard from "@/components/SkeletonComponents/SkeletonChatProfileCard.vue";
import {getChannelsOfUser, getDMsOfUser, RedirectToFTAuth} from "@/queries";
import {channelData, dmData, getChannelResp, getDmResp} from "@/queriesData";
import {EventBus} from "@/main";
import ChatJoin from "@/components/ChatContentAddons/ChatJoin.vue";

@Component({
	components: {ChatJoin, SkeletonChatProfileCard, ChatProfileCard},
	props: {
		user: Object,
		loaded: Boolean,
		showDrawer: Boolean
	},
	data: () => ({
		curChan: "",
		isDm: false,
		items: [
			{
				id: 'chan',
				name: "Channels",
				children: [] as Array<channelData>
			},
			{
				id: 'dm',
				name: "Private Messages",
				children: [] as Array<dmData>
			}
		]
	}),

	methods: {
		handleClick(chan: channelData) {
			this.$emit('changedChannel', chan)
			this.$data.curChan = chan.name
			this.$data.isDm = chan.isDm
		},
		handleLeave() {
			if (this.$data.curChan === "") {
				EventBus.$emit("chatSnack", "You must select a channel first", "red")
				return
			}
			if (this.$data.isDm) {
				EventBus.$emit("chatSnack", "You cannot leave Dms", "red")
				return
			}
			this.$socket.emit('leave', {
				channel: this.$data.curChan
			})
		},
		loadChannels() {
			getChannelsOfUser(this.$props.user.login)
				.then((data: getChannelResp) => {
					if (data.thereIsChannel) {
						data.channels.forEach((chan: channelData) => {
							chan.id= "chan-" + chan.id
							chan.isDm = false
						})
						this.$data.items[0].children = data.channels
					} else {
						this.$data.items[0].children = []
					}
				})
				.catch((e) => {
					if (e.response) {
						if (e.response.status >= 401 && e.response.status <= 403) {
							this.$cookies.remove("Session")
							RedirectToFTAuth()
							return
						}
						if (e.response.status == 404)
							return
					}
					EventBus.$emit("down", "")
				})
		},
		loadDMs() {
			getDMsOfUser(this.$props.user.login)
				.then((data: getDmResp) => {
					if (data.thereIsDm) {
						data.dms.forEach((dm: dmData) => {
							dm.id = "dm-" + dm.id
							dm.name = dm.user
							dm.isDm = true
						})
						this.$data.items[1].children = data.dms
					} else {
						this.$data.items[1].children = []
					}
				})
				.catch((e) => {
					if (e.response) {
						if (e.response.status >= 401 && e.response.status <= 403) {
							this.$cookies.remove("Session")
							RedirectToFTAuth()
							return
						}
						if (e.response.status == 404)
							return
					}
					EventBus.$emit("down", "")
				})
		}
	},
	mounted() {
		this.loadChannels()
		this.loadDMs()

		EventBus.$on('chanUpdate', () => {
			this.loadChannels()
			this.loadDMs()
		})
	}
})
export default class ChatNavDrawer extends Vue {
}
</script>

<style scoped>

</style>
