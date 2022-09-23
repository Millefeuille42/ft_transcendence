<template>
	<v-sheet style="width: 100%; height: 100%" class="d-flex flex-row justify-space-between" color="transparent">
		<v-sheet color="transparent" height="100%"
				 :width="$vuetify.breakpoint.mobile ? '100%' : '55%'"
				 class="d-flex flex-column justify-space-around">
			<TransparentCard>
				<template v-if="!$vuetify.breakpoint.mobile">
					<v-skeleton-loader v-if="!loaded" type="paragraph, text@3"/>
					<ProfileCardStats v-else :dialog="false" :stats="stats" class="mt-auto mb-auto"/>
				</template>
				<template v-else>
					<v-btn @click="showStats = true"> Stats </v-btn>
					<v-btn @click="showHistory = true" class="mt-6"> Match History </v-btn>
					<v-dialog dark v-model="showStats">
						<v-sheet width="98%" height="200px">
							<ProfileCardStats :stats="stats" :dialog="false" ></ProfileCardStats>
						</v-sheet>
					</v-dialog>
					<v-dialog v-model="showHistory" dark>
						<ProfileCardMatchHistoryDialog v-if="loaded" :is_rounded="false" :user="user" :stats="stats"/>
					</v-dialog>
				</template>
			</TransparentCard>
			<TransparentCard>
				<v-sheet width="100%" height="100%" class="d-flex flex-row justify-space-around" color="transparent">
					<v-btn fab x-large :disabled="stats.points <= 0" color="red" class="mt-auto mb-auto" :loading="!loadedItem" @click="getItem"> DROP </v-btn>
					<v-sheet width="50%" height="80%" color="transparent" class="mt-auto mb-auto d-flex flex-column justify-center">
						<v-img v-if="loadedItem" :alt="item.name" :title="item.name" contain width="100%" height="80%"
							   :class="$vuetify.breakpoint.mobile ? '' : 'mb-4'"
							   :src="item.name === '' ? '/gifButton.gif' : item.description">
						</v-img>
						<v-sheet v-else color="transparent">
							<v-avatar size="128">
								<v-img src="/pandaLoading.gif"/>
							</v-avatar>
						</v-sheet>
						<v-sheet v-if="!$vuetify.breakpoint.mobile && loadedItem && item.name !== ''" color="transparent">
							{{ "You got: " +  item.name + " (" + item.rarity + ")" }}
						</v-sheet>
					</v-sheet>
				</v-sheet>
			</TransparentCard>
		</v-sheet>
		<v-sheet v-if="!$vuetify.breakpoint.mobile" :width="hasMatch ? '50%' : '45%'" height="100%" color="transparent" elevation="4" rounded="xl">
			<v-img height="100%" v-if="!hasMatch" src="/gifPanda.gif" style="border-radius: 20px"/>
			<ProfileCardMatchHistoryDialog :max_height="'90%'" v-else height="100%" :stats="stats" :user="user"/>
		</v-sheet>
		<v-snackbar v-model="snackShow" :color="snackColor" timeout="2000" > {{ snackText }} </v-snackbar>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ProfileCardStats from "@/components/ProfileContentAddons/ProfileCardAddon/ProfileCardStats.vue";
import {inventoryItem, match, statsIn, userDataIn} from "@/queriesData";
import {dropItem, getHistory, getUserStats, RedirectToFTAuth} from "@/queries";
import ProfileCard from "@/components/ProfileContentAddons/ProfileCard.vue";
import TransparentCard from "@/components/TransparentCard.vue";
import ProfileCardMatchHistoryDialog
	from "@/components/ProfileContentAddons/ProfileCardAddon/ProfileCardMatchHistoryDialog.vue";
import {EventBus} from "@/main";


@Component({
	components: {ProfileCardMatchHistoryDialog, TransparentCard, ProfileCard, ProfileCardStats},
	props: {
		user: Object as () => userDataIn
	},
	data: () => ({
		stats: Object as () => userDataIn,
		loaded: false,
		rivalData: Object as () => userDataIn,
		loadedRival: false,
		hasMatch: false,
		item: {name: ""} as () => inventoryItem,
		loadedItem: true,

		showStats: false,
		showHistory: false,
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
		getItem() {
			this.$data.loadedItem = false
			dropItem(this.$props.user.login)
				.then(async (dropped: inventoryItem) => {
					this.$data.item = dropped
					setTimeout(async () => {
						this.$data.loadedItem = true
						await this.loadUserStats()
						await this.loadUserHistory()
					}, 3000);
				})
				.catch((e) => {
					if (e.response.status == "442") {
						this.$data.loadedItem = true
						this.showSnack("You are out of points!", "red")
						this.loadUserStats()
						this.loadUserHistory()
						return
					}
					if (e.response.status >= 401 && e.response.status <= 404) {
						this.$cookies.remove("Session")
						RedirectToFTAuth()
						return
					}
					EventBus.$emit("down", "")
				})
		},
		async loadUserStats() {
			this.$data.loaded = false
			await getUserStats(this.$props.user.login)
				.then((stats: statsIn) => {
					this.$data.stats = stats
				})
				.catch((e) => {
					if (e.response && e.response.status >= 401 && e.response.status <= 404) {
						this.$cookies.remove("Session")
						RedirectToFTAuth()
						return
					}
					EventBus.$emit("down", "")
				})
		},
		async loadUserHistory() {
			this.$data.hasMatch = false
			await getHistory(this.$props.user.login)
				.then((history: match[]) => {
					if (history.length > 0) {
						this.$data.hasMatch = true
						this.$data.stats.history = history
					}
					this.$data.loaded = true
				})
				.catch((e) => {
					if (e.response.status >= 401 && e.response.status <= 404) {
						this.$cookies.remove("Session")
						RedirectToFTAuth()
						return
					}
					EventBus.$emit("down", "")
				})
		}
	},
	async mounted() {
		this.$data.loaded = false
		this.$data.loadedRival = false

		await this.loadUserStats()
		await this.loadUserHistory()
		if (!this.$data.loaded || this.$data.stats.lastRival === "No one :(")
			return
	}
})
export default class ProfileStats extends Vue {
}
</script>

<style scoped>

</style>
