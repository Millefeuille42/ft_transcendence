<template>
	<v-container fill-height class="d-flex flex-column justify-center align-center pa-6">
		<v-btn @click="showGame = true" color="red" class="mt-auto" x-large> PLAY </v-btn>
		<v-dialog dark width="100%" fullscreen v-model="showGame">
			<v-sheet
				width="100%"
				color="rgb(0, 0, 0, 0.6)"
				height="100%"
				style="backdrop-filter: blur(13px); -webkit-backdrop-filter: blur(13px)"
			>
				<v-btn @click="showGame=false" fab x-small class="ma-2"> X </v-btn>
				<v-sheet elevation="0"
						 color="transparent"
						 height="90%" width="90%" class="mx-auto d-flex flex-column align-center justify-center">
					<div id="game" style="width: 98%; height: 98%; margin-top: auto; margin-bottom: auto">
						<iframe v-if="showGame" width="100%" height="100%"
								style="border: 0"
								:src="`http://e1r12p3:1234?login=${user.login}&token=${session}`" > Browser not compatible </iframe>
					</div>
				</v-sheet>
			</v-sheet>
		</v-dialog>
		<v-sheet height="30%" width="100%" class="d-flex mt-auto flex-row">
			<v-sheet v-if="!$vuetify.breakpoint.mobile" height="100%" width="67%" elevation="6" class="mt-auto" rounded="bl-xl">
				<ProfileCardMatchHistoryDialog v-if="loaded" :max_height="'80%'" :user="user" :stats="stats" />
			</v-sheet>
			<v-sheet elevation="6" height="100%"
					 :width="$vuetify.breakpoint.mobile ? '100%' : '30%'"
					 class="ml-auto" rounded="br-xl">
				<HomeContentOnlineList :user="user"/>
			</v-sheet>
		</v-sheet>
	</v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import HomeContentOnlineList from "@/components/HomeContentAddons/HomeContentOnlineList.vue";
import ProfileCardMatchHistoryDialog
	from "@/components/ProfileContentAddons/ProfileCardAddon/ProfileCardMatchHistoryDialog.vue";
import {getUserStats} from "@/queries";
import {statsIn} from "@/queriesData";
import {EventBus} from "@/main";

@Component({
	components: {ProfileCardMatchHistoryDialog, HomeContentOnlineList},
	props: {
		user: Object
	},
	data: () => ({
		showGame: false,
		session: "",
		canvas: Object,
		stats: {},
		loaded: false,
	}),
	methods: {
		loadStats() {
			this.$data.loaded = false
			getUserStats(this.$props.user.login)
				.then((stats: statsIn) => {
					this.$data.stats = stats
					this.$data.loaded = true
				})
		}
	},
	sockets: {
		userStatus() {
			EventBus.$emit("updateOnlineList")
			setTimeout(() => {
				EventBus.$emit("updateFriendStatus")
			}, 200)
		},
		auth(data) {
			EventBus.$emit('authSock', data);
		},
	},
	mounted() {
		this.$data.session = this.$cookies.get("Session")
		setTimeout(() => {
			this.$socket.emit('auth', {
				token: this.$cookies.get("Session"),
				login: this.$cookies.get("Login")
			})
		},1000)
		this.loadStats()
	}
})
export default class HomeContent extends Vue {
}
</script>

<style scoped>
</style>
