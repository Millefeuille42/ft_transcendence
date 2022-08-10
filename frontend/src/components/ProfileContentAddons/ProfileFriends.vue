<template>
	<v-sheet style="width: 100%; height: 100%" class="d-flex justify-space-between" color="">
		<SkeletonProfileFriends v-if="!loaded"></SkeletonProfileFriends>
		<v-sheet width="33%" height="100%" class="overflow-y-auto" v-if="loaded && hasFriends">
			<v-list>
				<template v-for="friend in friends">
					<v-list-item :key="friend.login" class="mr-5 pl-0">
						<v-btn width="100%" height="20%" rounded
							   class="d-flex justify-center mb-2 mt-2 pl-4" color="grey darken-4">
							<v-list-item-avatar>
								<v-img :src="friend.avatar"/>
							</v-list-item-avatar>
							<v-list-item-content color="grey">
								<v-list-item-title class="text-left">{{ friend.username }}</v-list-item-title>
							</v-list-item-content>
						</v-btn>
					</v-list-item>
				</template>
			</v-list>
		</v-sheet>
		<v-img v-if="loaded && !hasFriends" src="@/assets/pong-bg.jpg" />
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ProfileCard from "@/components/ProfileContentAddons/ProfileCard.vue";
import {getFriendsList, getUserData} from "@/queries";
import {friendListIn, userDataIn} from "@/queriesData";
import SkeletonProfileFriends from "@/components/SkeletonComponents/SkeletonProfileFriends.vue"

@Component({
	components: {ProfileCard, SkeletonProfileFriends},
	data: () => ({
		loaded: false,
		hasFriends: false,
		friends: Array,
	}),
	props: {
		user: Object
	},
	async mounted() {
		try {
			this.$data.friends = []
			let friendList: friendListIn = await getFriendsList(this.$props.user.login)
			console.log(friendList)
			if (friendList.thereIsFriend) {
				this.$data.hasFriends = true
				for (let friend in friendList.listOfFriends) {
					try {
						let friendData: userDataIn = await getUserData(friendList.listOfFriends[friend])
						this.$data.friends.push(friendData)
						this.$data.friends.push(friendData)
						this.$data.friends.push(friendData)
						this.$data.friends.push(friendData)
						this.$data.friends.push(friendData)
						this.$data.friends.push(friendData)
						this.$data.friends.push(friendData)
						this.$data.friends.push(friendData)
						this.$data.friends.push(friendData)
						this.$data.friends.push(friendData)
						this.$data.friends.push(friendData)
						this.$data.friends.push(friendData)
						this.$data.friends.push(friendData)
						this.$data.friends.push(friendData)
						this.$data.friends.push(friendData)
						this.$data.friends.push(friendData)
					} catch (e) {
						console.log(e)
					}
				}
			}
			this.$data.loaded = true
			console.log(this.$data.hasFriends)
			console.log(this.$data.friends)
		} catch (e) {
			console.log(e);
		}
	}
})
export default class ProfileFriends extends Vue {}
</script>

<style scoped>

</style>
