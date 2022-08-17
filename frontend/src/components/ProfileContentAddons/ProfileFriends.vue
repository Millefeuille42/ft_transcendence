<template>
	<v-sheet style="width: 100%; height: 100%" class="d-flex flex-column align-items" color="">
		<SkeletonProfileFriends v-if="!loaded"></SkeletonProfileFriends>
		<v-sheet width="100%" height="85%" class="d-flex justify-space-between justify-space-between mb-auto">
			<v-sheet width="33%" height="100%" class="overflow-y-auto" v-if="loaded && hasFriends">
				<v-list>
					<template v-for="friend in friends">
							<v-list-item :key="friend.login" class="mr-5 pl-0 ml-2">
								<v-btn width="100%" height="20%" rounded :key="'btn-' + friend.login"
									   @click="selectedFriend = friend; hasFriendSelected = true"
									   class="d-flex justify-center mb-2 mt-2 pl-4" color="grey darken-4">
									<v-list-item-avatar>
											<v-img :src="friend.avatar"/>
									</v-list-item-avatar>
									<v-badge v-if="friend.status !== 'not loaded'"
											 bottom overlap dot offset-x="25" offset-y="20"
											 :color="friend.status === 'online' ? 'green' : 'red'"></v-badge>
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
			<v-sheet width="63%" rounded="xl" height="100%">
				<ProfileCard v-if="hasFriendSelected" :user="selectedFriend" height="100%"/>
			</v-sheet>
		</v-sheet>
		<v-img v-if="loaded && !hasFriends" src="@/assets/pong-bg.jpg" height="80%" />
		<ProfileFriendsAddFriend v-if="loaded" :user="user" @input="addFriendFromForm" />
		<v-snackbar v-model="snackShow" :color="snackColor" timeout="2000" > {{ snackText }} </v-snackbar>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ProfileCard from "@/components/ProfileContentAddons/ProfileCard.vue";
import {getFriendsList, getFriendStatus, getUserData, removeFriendFromList} from "@/queries";
import {friendListIn, userDataIn} from "@/queriesData";
import SkeletonProfileFriends from "@/components/SkeletonComponents/SkeletonProfileFriends.vue"
import ProfileFriendsAddFriend from "@/components/ProfileContentAddons/ProfileFriendsAddon/ProfileFriendsAddFriend.vue";

@Component({
	components: {ProfileFriendsAddFriend, ProfileCard, SkeletonProfileFriends},
	data: () => ({
		loaded: false,
		hasFriends: false,
		hasFriendSelected: false,
		friends: Array,
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
		},
		async removeFriend(friend: userDataIn) {
			let that = this
			removeFriendFromList(this.$props.user.login, friend.login).then(function() {
				const index = that.$data.friends.indexOf(friend, 0);
				if (index > -1)
					that.$data.friends.splice(index, 1);
				if (that.$data.friends.length <= 0)
					that.$data.hasFriends = false
				if (that.$data.selectedFriend === friend) {
					that.$data.selectedFriend = Object as () => userDataIn
					that.$data.hasFriendSelected = false
				}
			}).catch(() => {
				this.showSnack("Failed to remove " + friend.username, "red")
			})
			this.showSnack(friend.username + " removed", "green")
		},
		async loadFriends() {
			try {
				this.$data.friends = []
				let friendList: friendListIn = await getFriendsList(this.$props.user.login)
				if (friendList.thereIsFriend) {
					this.$data.hasFriends = true
					for (let friend in friendList.listOfFriends) {
						let that = this
						getUserData(friendList.listOfFriends[friend])
							.then(async function (friendData: userDataIn) {
								friendData.status = "not loaded"
								getFriendStatus(that.$props.user.login, friendData.login)
									.then (function (onlineData: string) {
										let fFriend = that.$data.friends.find((f: userDataIn) => f.login === friendData.login)
										if (fFriend)
											fFriend.status = onlineData
									}).catch(() => {
									that.showSnack("Failed to get " + friend + " status", "red")
								})
								if (!friendData.banner)
									friendData.banner = "https://picsum.photos/1920/1080?random";
								that.$data.friends.push(friendData)
							}).catch(() => {
							that.showSnack("Failed to get " + friend + " data", "red")
						})
					}
				}
				this.$data.loaded = true
			} catch (e) {
				this.showSnack("Failed to get friend list", "red")
			}
		},
	},
	async mounted() {
		await this.loadFriends()
	},
})
export default class ProfileFriends extends Vue {}
</script>

<style scoped>

</style>
