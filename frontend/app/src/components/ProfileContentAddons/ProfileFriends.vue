<template>
	<v-sheet style="width: 100%; height: 100%" class="d-flex flex-column align-items" color="">
		<SkeletonProfileFriends v-if="!loaded"></SkeletonProfileFriends>
		<v-sheet width="100%" height="85%" class="d-flex justify-space-between mb-auto">
			<v-sheet :width="$vuetify.breakpoint.mobile ? '100%' : '33%'"
					 height="100%" class="overflow-y-auto" v-if="loaded && hasFriends">
				<v-list>
					<template v-for="friend in friends">
							<v-list-item :key="friend.login" class="mr-5 pl-0 ml-2">
								<v-btn width="100%" height="20%" rounded :key="'btn-' + friend.login"
									   @click="handleSelect(friend)"
									   class="d-flex justify-center mb-2 mt-2 pl-4" color="grey darken-4">
									<v-list-item-avatar>
											<v-img :src="friend.avatar"/>
									</v-list-item-avatar>
									<v-badge v-if="friend.status !== 'not loaded'"
											 bottom overlap dot offset-x="25" offset-y="20"
											 :color="friend.status === 'online' ? 'green' : (friend.status === 'in-game' ? 'blue' : 'red')"></v-badge>
									<v-list-item-content color="grey">
										<v-list-item-title class="text-left">{{ friend.username }}</v-list-item-title>
									</v-list-item-content>
								</v-btn>
								<v-btn icon x-small class="ml-2" color="white" @click="removeFriend(friend)">
									<v-icon>mdi-close-circle</v-icon>
								</v-btn>
							</v-list-item>
					</template>
				</v-list>
			</v-sheet>
			<v-sheet v-if="!$vuetify.breakpoint.mobile" width="63%" rounded="xl" height="100%">
				<ProfileCard v-if="hasFriendSelected" :user="selectedFriend" :friend="true" height="100%" mWidth="100%"/>
				<v-img height="100%" width="80%" v-else-if="loaded && hasFriends" src="/giphy.gif" style="border-radius: 20px"/>
			</v-sheet>
		</v-sheet>
		<v-img v-if="loaded && !hasFriends" src="@/assets/curly.png" height="80%" />
		<ProfileFriendsAddFriend v-if="loaded" :user="user" @input="addFriendFromForm" />
		<v-snackbar v-model="snackShow" :color="snackColor" timeout="2000" > {{ snackText }} </v-snackbar>

		<v-dialog v-if="$vuetify.breakpoint.mobile" v-model="hasFriendSelected" width="70%" dark
				  fullscreen
				  transition="dialog-bottom-transition"
		>
			<ProfileCard v-if="hasFriendSelected" height="100%" :user="selectedFriend" mWidth="100%" rounded="false"/>
		</v-dialog>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ProfileCard from "@/components/ProfileContentAddons/ProfileCard.vue";
import {getFriendsList, getFriendStatus, getUserData, RedirectToFTAuth, removeFriendFromList} from "@/queries";
import {friendListIn, userDataIn} from "@/queriesData";
import SkeletonProfileFriends from "@/components/SkeletonComponents/SkeletonProfileFriends.vue"
import ProfileFriendsAddFriend from "@/components/ProfileContentAddons/ProfileFriendsAddon/ProfileFriendsAddFriend.vue";
import {EventBus} from "@/main";

@Component({
	components: {ProfileFriendsAddFriend, ProfileCard, SkeletonProfileFriends},
	data: () => ({
		loaded: false,
		hasFriends: false,
		hasFriendSelected: false,
		friends: [] as userDataIn[],
		selectedFriend: Object as () => userDataIn,

		snackShow: false,
		snackText: "",
		snackColor: "green"
	}),
	props: {
		user: Object
	},
	methods: {
		showSnack(text: string, color: string) {
			this.$data.snackColor = color
			this.$data.snackText = text
			this.$data.snackShow = true
		},
		async addFriendFromForm(friendData: userDataIn) {
			this.$data.friends.push(friendData)
			this.$data.hasFriends = true
			this.showSnack(friendData.username + " added", "green")
			EventBus.$emit("updateOnlineList", "")
		},
		async removeFriend(friend: userDataIn) {
			let that = this
			await removeFriendFromList(this.$props.user.login, friend.login).then(function() {
				const index = that.$data.friends.indexOf(friend, 0);
				if (index > -1)
					that.$data.friends.splice(index, 1);
				if (that.$data.friends.length <= 0)
					that.$data.hasFriends = false
				if (that.$data.selectedFriend === friend) {
					that.$data.selectedFriend = Object as () => userDataIn
					that.$data.hasFriendSelected = false
				}
				EventBus.$emit("updateOnlineList", "")
			}).catch(() => {
				this.showSnack("Failed to remove " + friend.username, "red")
			})
			this.showSnack(friend.username + " removed", "green")
		},

		async loadFriendStatus(friend: string) {
			let that = this
			getFriendStatus(friend)
				.then (function (onlineData: string) {
					console.log(onlineData)
					let fFriend: userDataIn = that.$data.friends.find((f: userDataIn) => f.login === friend)
					if (fFriend)
						fFriend.status = onlineData
				}).catch((e) => {
					if ( e.response && e.response.status >= 401 && e.response.status <= 404) {
						this.$cookies.remove("Session")
						RedirectToFTAuth()
						return
					}
					EventBus.$emit("down", "")
				})
		},
		async loadFriendData(friend: string) {
			getUserData(friend)
				.then((friendData: userDataIn) => {
					friendData.status = "not loaded"
					if (!friendData.banner)
						friendData.banner = "https://picsum.photos/1920/1080?random";
					this.$data.friends.push(friendData)
					this.loadFriendStatus(friend)
				}).catch((e) => {
				if (e.response && e.response.status >= 401 && e.response.status <= 404) {
					this.$cookies.remove("Session")
					RedirectToFTAuth()
					return
				}
					EventBus.$emit("down", "")
				})
		},
		async loadFriends(): Promise<friendListIn> {
			this.$data.friends = []
			this.$data.hasFriends = false
			let that = this
			return await getFriendsList(this.$props.user.login)
				.then((friendList: friendListIn) => {
					that.$data.hasFriends = friendList.thereIsFriend
					return friendList
				}).catch((e) => {
					if (e.response && e.response.status >= 401 && e.response.status <= 404) {
						this.$cookies.remove("Session")
						RedirectToFTAuth()
						return {thereIsFriend: false, listOfFriends: []} as friendListIn
					}
					EventBus.$emit("down", "")
					return {thereIsFriend: false, listOfFriends: []} as friendListIn
				})
		},
		handleSelect(friend: userDataIn) {
			this.$data.hasFriendSelected = false
			setTimeout(() => {
				this.$data.hasFriendSelected = true
			}, 100)
			this.$data.selectedFriend = friend
		}
	},
	async mounted() {
		let friendList: friendListIn = await this.loadFriends()
		this.$data.loaded = true
		if (!this.$data.hasFriends)
			return
		for (let friend in friendList.listOfFriends) {
			this.loadFriendData(friendList.listOfFriends[friend]).then()
		}

		EventBus.$on('updateFriendStatus', async () => {
			let fl: friendListIn = await this.loadFriends()
			this.$data.loaded = true
			if (!this.$data.hasFriends)
				return
			for (let friend in fl.listOfFriends) {
				this.loadFriendData(fl.listOfFriends[friend]).then()
			}
		})

		EventBus.$on("unloadCard", () => {
			this.$data.hasFriendSelected = false
		})
	},
})
export default class ProfileFriends extends Vue {}
</script>

<style scoped>

</style>
