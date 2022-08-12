<template>
	<v-sheet width="33%" height="15%" class="ml-auto mr-auto mt-4 d-flex justify-center align-center">
		<v-text-field
			v-model=formFriend
			label="Add a friend"
			required
		></v-text-field>
		<v-btn  class="ml-8" @click="formCheck"
		>submit</v-btn>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {addFriend, getFriendStatus, getUserData} from "@/queries";
import {userDataIn} from "@/queriesData";

@Component({
	props: {
		user: Object,
		value: Function
	},
	data: () => ({
		formFriend: ""
	}),
	methods: {
		async formCheck() {
			try {
				await addFriend(this.$props.user.login, this.$data.formFriend)
				try {
					let friendData: userDataIn = await getUserData(this.$data.formFriend)
					let onlineData: string = await getFriendStatus(this.$props.user.login, friendData.login)
					if (!friendData.banner)
						friendData.banner = "https://picsum.photos/1920/1080?random";
					friendData.status = onlineData
					this.$emit('input', friendData)
				} catch (e) {
					console.log(e)
				}
			} catch (e) {
				console.log(e)
			}
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
