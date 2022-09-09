<template>
	<v-sheet :width="$vuetify.breakpoint.mobile ? '100%' : '33%'" height="15%" class="ml-auto mr-auto mt-4 d-flex justify-center align-center">
		<v-text-field
			v-model=formFriend
			label="Add a friend"
			required
		></v-text-field>
		<v-btn  class="ml-8" @click="formCheck" :loading="addFriendLoading">submit</v-btn>
		<v-snackbar v-model="snackAddFriendError" color="red" tile timeout="2000">
			{{ snackErrorText }}
		</v-snackbar>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {addFriend, getFriendStatus, getUserData} from "@/queries";
import {userDataIn} from "@/queriesData";
import {EventBus} from "@/main";

@Component({
	props: {
		user: Object,
	},
	data: () => ({
		formFriend: "",
		addFriendLoading: false,
		snackAddFriendError: false,
		snackErrorText: "An unknown error occurred"
	}),
	methods: {
		async formCheck() {
			try {
				this.$data.addFriendLoading = true
				await addFriend(this.$props.user.login, this.$data.formFriend)
				try {
					let friendData: userDataIn = await getUserData(this.$data.formFriend)
					let onlineData: string = await getFriendStatus(this.$props.user.login, friendData.login)
					if (!friendData.banner)
						friendData.banner = "https://picsum.photos/1920/1080?random";
					friendData.status = onlineData
					this.$emit('input', friendData)
					this.$data.addFriendLoading = false
				} catch (e) {
					EventBus.$emit("down", "")
				}
			} catch (e: any) {
				if (e.response.status === 404)
					this.$data.snackErrorText = "User not found"
				else if (e.response.status === 400)
					this.$data.snackErrorText = "This user is already your friend"
				this.$data.snackAddFriendError = true
				this.$data.addFriendLoading = false
			}
			this.$data.formFriend = ""
		}
	},
	mounted() {
		this.$data.content = this.$props.value
	}
})
export default class ProfileFriendsAddFriend extends Vue {
}
</script>

<style scoped>

</style>
