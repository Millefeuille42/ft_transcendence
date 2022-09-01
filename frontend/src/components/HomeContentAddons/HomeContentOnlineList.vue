<template>
	<v-sheet class="" height="100%">
		<v-sheet class="text-h6 mb-4 pt-3" height="10%"> Online users </v-sheet>
		<v-sheet v-if="loaded" height="80%" class="overflow-y-auto">
			<v-list-item v-for="online in onlineList" :key="online.info.login" class="d-flex flex-row justify-space-between">
				<v-btn width="70%" height="20%" rounded :key="'btn-' + online.info.login"
					   @click="selectedUser = online; handleUserClick()"
					   class="d-flex justify-center mb-2 mt-2 pl-4" color="grey darken-4">
					<v-list-item-avatar>
						<v-img :src="online.info.avatar"/>
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
		<v-sheet v-else class="d-flex justify-center" width="100%" height="80%">
			<v-progress-circular class="mt-auto mb-auto" size="128" indeterminate></v-progress-circular>
		</v-sheet>
		<v-dialog v-model="hasUserSelected" width="70%" height="100%" dark>
			<ProfileCard v-if="hasUserSelected" height="100%" :user="selectedUser.info" mWidth="100%" rounded="false"/>
		</v-dialog>
		<v-snackbar v-model="snackShow" :color="snackColor" timeout="2000" > {{ snackText }} </v-snackbar>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {onlineDataIn} from "@/queriesData";
import {addBlock, addFriend, getOnlineList, removeFriendFromList} from "@/queries";
import ProfileCard from "@/components/ProfileContentAddons/ProfileCard.vue";
import {EventBus} from "@/main";

@Component({
	components: {ProfileCard},

	props: {
		user: Object
	},
	data: () => ({
		onlineList: Array,
		loaded: false,
		selectedUser: Object,
		hasUserSelected: false,
		friendLoading: false,
		snackShow: false,
		snackText: "",
		snackColor: "green"
	}),
	methods: {
		showSnack(text: string, color: string) {
			this.$data.snackColor = color
			this.$data.snackText = text
			this.$data.snackShow = true
		},
		handleUserClick() {
			if (this.$data.selectedUser.banner === "") {
				this.$data.selectedUser.banner = "https://picsum.photos/1920/1080?random";
			}
			this.$data.hasUserSelected = true
		},
		async handleBlock(block: onlineDataIn) {
			block.blockLoading = true
			addBlock(this.$props.user.login, block.info.login)
				.then(() => {
					EventBus.$emit("updateFriendList", "")
					setTimeout(() => {
						EventBus.$emit("updateOnlineList", "")
						this.showSnack(block.info.login + " blocked", "green")
						block.blockLoading = false
					}, 100)
				})
				.catch(() => {
					this.showSnack("Failed to block " + block.info.login, "red")
					block.blockLoading = false
				})
		},
		async handleAdd(friend: onlineDataIn) {
			friend.friendLoading = true
			addFriend(this.$props.user.login, friend.info.login)
				.then(() => {
					this.showSnack(friend.info.login + " added", "green")
					EventBus.$emit("updateFriendList", "")
					friend.friend = true
					friend.friendLoading = false
				})
				.catch((e) => {
					if (e.response.status === 404)
						this.showSnack(friend.info.login + " not found", "red")
					else if (e.response.status === 400)
						this.showSnack(friend.info.login + " is already your friend", "red")
					friend.friendLoading = false
				})
		},
		async handleRemove(friend: onlineDataIn) {
			friend.friendLoading = true
			removeFriendFromList(this.$props.user.login, friend.info.login)
				.then(() => {
					this.showSnack(friend.info.login + " removed", "green")
					EventBus.$emit("updateFriendList", "")
					friend.friend = false
					friend.friendLoading = false
				})
				.catch(() => {
					this.showSnack("Failed to remove " + friend.info.login, "red")
					friend.friendLoading = false
				})
		},
		async loadList() {
			this.$data.loaded = false
			getOnlineList(this.$props.user.login)
				.then((onlineList: onlineDataIn[]) => {
					for (let index in onlineList) {
						onlineList[index].friendLoading = false
						onlineList[index].blockLoading = false
					}
					this.$data.onlineList = onlineList
					this.$data.loaded = true
				})
				.catch((e) => {
					console.log(e)
				})
		}
	},
	mounted() {
		this.loadList()
		EventBus.$on("updateOnlineList", () => {
			this.loadList()
		})
	}
})
export default class HomeContentOnlineList extends Vue {
}
</script>

<style scoped>

</style>
