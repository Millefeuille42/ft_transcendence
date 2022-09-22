<template>
	<v-sheet height="10%" width="100%" class="d-flex flex-row justify-space-around align-center">
		<v-btn @click="showUsers = true">Users</v-btn>
		<v-navigation-drawer v-if="usersLoaded"
							 app
							 temporary
							 v-model="showUsers"
		>
			<v-sheet height="100%" width="100%" color="transparent" class="d-flex justify-center align-center">
				<v-sheet height="90%" width="100%" color="transparent" >
					<v-list-item v-for="user in users">
						<v-btn @click="handleClickUser(user.login)" width="100%" height="20%" rounded :key="'btn-' + user.login" class="d-flex justify-center pl-4 my-2" color="grey darken-4">
							<v-list-item-avatar>
								<v-img :src="user.avatar"/>
							</v-list-item-avatar>
							<v-list-item-content color="grey">
								<v-list-item-title class="text-left">{{ user.username }}</v-list-item-title>
							</v-list-item-content>
						</v-btn>
					</v-list-item>
				</v-sheet>
			</v-sheet>
			<v-dialog v-model="hasUserSelected" width="30%" dark
					  fullscreen
					  transition="dialog-bottom-transition"
			>
				<ChatProfileCardLoader v-if="hasUserSelected" :login="selectedUser"/>
				<v-btn v-if="selectedUser !== login"> Invite </v-btn>
				<v-sheet v-if="isAdmin && selectedUser !== login" width="100%" height="40%" class="d-flex flex-column align-center mt-auto">
					<v-sheet width="60%" class="d-flex flex-row justify-space-around mt-12  my-4">
						<v-btn width="20%" > Mute </v-btn>
						<v-sheet width="60%" class="d-flex">
							<v-slider
								v-model="muteTime"
								:max="20"
								:min="5"
							>
							</v-slider>
						</v-sheet>
						{{ muteTime }}
					</v-sheet>
					<v-sheet width="60%" class="d-flex flex-row justify-space-around  my-4">
						<v-btn width="20%"> Ban </v-btn>
						<v-sheet width="60%">
							<v-slider
								v-model="banTime"
								:max="20"
								:min="5"
							>
							</v-slider>
						</v-sheet>
						{{ banTime }}
					</v-sheet>
					<v-btn> Make Admin </v-btn>
				</v-sheet>
			</v-dialog>
		</v-navigation-drawer>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ChatProfileCardLoader from "@/components/ChatContentAddons/ChatProfileCardLoader.vue";
import {EventBus} from "@/main";

@Component({
	components: {ChatProfileCardLoader},
	props: {
		users: [],
		usersLoaded: Boolean,
		login: String,
		isAdmin: Boolean
	},
	data: () => ({
		muteTime: 0,
		banTime: 0,
		hasUserSelected: false,
		selectedUser: "",
		showUsers: false,
	}),
	methods: {
		handleClickUser(login: string) {
			this.$data.selectedUser = login
			this.$data.hasUserSelected = true
		},
	},
	mounted() {
		EventBus.$on("unloadCard", () => {
			this.$data.hasUserSelected = false
		})
	}
})
export default class ChatUsersDrawer extends Vue {
}
</script>

<style scoped>

</style>
