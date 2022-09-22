<template>
	<v-sheet height="100%">
		<ProfileCard v-if="loadedUser" height="100%" :user="user" mWidth="100%" rounded="false"></ProfileCard>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ProfileCard from "@/components/ProfileContentAddons/ProfileCard.vue";
import {userDataIn} from "@/queriesData";
import {getUserData} from "@/queries";

@Component({
	components: {ProfileCard},
	props: {
		login: String
	},
	data: () => ({
		user: {} as userDataIn,
		loadedUser: false
	}),
	mounted() {
		getUserData(this.$props.login).then((data: userDataIn) => {
			this.$data.user = data
			this.$data.loadedUser = true
		}).catch((e) => {
			console.log(e)
		})
	}
})
export default class ChatProfileCardLoader extends Vue {
}
</script>

<style scoped>

</style>
