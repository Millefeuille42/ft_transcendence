<template>
	<v-sheet style="width: 100%; height: 100%" class="d-flex flex-row justify-space-between" color="transparent">
		<v-sheet color="transparent" height="100%" width="55%" class="d-flex flex-column justify-space-around">
			<TransparentCard>
				<v-skeleton-loader v-if="!loaded" type="paragraph, text@3"/>
				<ProfileCardStats v-else :stats="stats" class="mt-auto mb-auto"/>
			</TransparentCard>
			<TransparentCard>
				<v-sheet width="100%" height="100%" class="d-flex flex-row justify-space-around" color="transparent">
					<v-btn fab x-large :disabled="stats.points <= 0" color="red" class="mt-auto mb-auto" :loading="!loadedItem" @click="getItem"> DROP </v-btn>
					<v-sheet width="50%" height="80%" color="transparent" class="mt-auto mb-auto d-flex flex-column justify-center">
						<v-img v-if="loadedItem" :alt="item.name" :title="item.name" contain width="100%" height="80%" class="mb-4"
							   :src="item.name === '' ? '/gifButton.gif' : item.description">
						</v-img>
						<v-sheet v-else color="transparent">
							<v-avatar size="128">
								<v-img src="/pandaLoading.gif"/>
							</v-avatar>
						</v-sheet>
						<v-sheet v-if="loadedItem && item.name !== ''" color="transparent">
							{{ "You got: " +  item.name + " (" + item.rarity + ")" }}
						</v-sheet>
					</v-sheet>
				</v-sheet>
			</TransparentCard>
		</v-sheet>
		<v-sheet width="40%" height="100%" color="transparent">
			<v-img height="100%" v-if="!loadedRival" src="/gifPanda.gif" style="border-radius: 20px"/>
			<ProfileCard v-else height="100%" :user="rivalData"/>
		</v-sheet>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ProfileCardStats from "@/components/ProfileContentAddons/ProfileCardAddon/ProfileCardStats.vue";
import {inventoryItem, statsIn, userDataIn} from "@/queriesData";
import {dropItem, getUserData, getUserStats} from "@/queries";
import ProfileCard from "@/components/ProfileContentAddons/ProfileCard.vue";
import TransparentCard from "@/components/TransparentCard.vue";


@Component({
	components: {TransparentCard, ProfileCard, ProfileCardStats},
	props: {
		user: Object as () => userDataIn
	},
	data: () => ({
		stats: Object as () => statsIn,
		loaded: false,
		rivalData: Object as () => userDataIn,
		loadedRival: false,
		item: {name: ""} as () => inventoryItem,
		loadedItem: true,
	}),
	methods: {
		getItem() {
			this.$data.loadedItem = false
			dropItem(this.$props.user.login)
				.then((dropped: inventoryItem) => {
					this.$data.item = dropped
					setTimeout(() => {
						this.$data.loadedItem = true
						this.loadUserStats()
					}, 3000);
				})
				.catch(() => {

				})
		},
		async loadUserStats() {
			this.$data.loaded = false
			await getUserStats(this.$props.user.login)
				.then((stats: statsIn) => {
					this.$data.stats = stats
					this.$data.loaded = true
				})
				.catch((e) => {
					console.log(e)
				})
		}
	},
	async mounted() {
		this.$data.loaded = false
		this.$data.loadedRival = false

		await this.loadUserStats()
		if (!this.$data.loaded || this.$data.stats.lastRival === "No one :(")
			return
		getUserData(this.$data.stats.lastRival).then((data: userDataIn) => {
			if (!data.banner)
				data.banner = "https://picsum.photos/1920/1080?random";
			this.$data.rivalData = data
			this.$data.loadedRival = true
		})
	}
})
export default class ProfileStats extends Vue {
}
</script>

<style scoped>

</style>
