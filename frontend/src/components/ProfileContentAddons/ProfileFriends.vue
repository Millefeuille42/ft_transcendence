<template>
	<v-sheet style="width: 100%; height: 100%" class="d-flex flex-column justify-space-between" color="">
		<SkeletonProfileFriends v-if="!loaded"></SkeletonProfileFriends>
		<v-sheet width="33%" height="100%" class="overflow-y-auto" v-if="loaded && hasFriends">
			<v-list>
				<template v-for="friend in friends">
					<v-list-item :key="friend.login" class="mr-5 pl-0">
						<v-btn width="100%" height="20%" rounded :key="'btn-' + friend.login"
							   @click="selectedFriend = friend; hasFriendSelected = true"
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
		<v-img v-if="loaded && !hasFriends" src="@/assets/pong-bg.jpg" height="80%" />
		<v-sheet width="33%" height="15%" class="ml-auto mr-auto d-flex justify-center align-center">
			<v-text-field
				v-model=formFriend
				label="Add a friend"
				required
			></v-text-field>
			<v-btn  class="ml-8" @click="formCheck"
			>submit</v-btn>
		</v-sheet>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ProfileCard from "@/components/ProfileContentAddons/ProfileCard.vue";
import {addFriend, getFriendsList, getUserData} from "@/queries";
import {friendListIn, userDataIn} from "@/queriesData";
import SkeletonProfileFriends from "@/components/SkeletonComponents/SkeletonProfileFriends.vue"

@Component({
	components: {ProfileCard, SkeletonProfileFriends},
	data: () => ({
		loaded: false,
		hasFriends: false,
		friends: Array,
		formFriend: "",
		selectedFriend: Object,
		hasFriendSelected: false
	}),
	props: {
		user: Object
	},
	methods: {
		async formCheck() {
			try {
				await addFriend(this.$props.user.login, this.$data.formFriend)
				try {
					let friendData: userDataIn = await getUserData(this.$data.formFriend)
					this.$data.friends.push(friendData)
					this.$data.hasFriends = true
				} catch (e) {
					console.log(e)
				}
			} catch (e) {
				console.log(e)
			}
		}
	},
	async mounted() {
		try {
			this.$data.friends = []
			let friendList: friendListIn = await getFriendsList(this.$props.user.login)
			if (friendList.thereIsFriend) {
				this.$data.hasFriends = true
				for (let friend in friendList.listOfFriends) {
					try {
						let friendData: userDataIn = await getUserData(friendList.listOfFriends[friend])
						this.$data.friends.push(friendData)
					} catch (e) {
						console.log(e)
					}
				}
			}
			this.$data.loaded = true
		} catch (e) {
			console.log(e);
		}
	}
})
export default class ProfileFriends extends Vue {}
</script>

<style scoped>

</style>
