<template>
	<v-container fill-height class="d-flex flex-column pa-6">
			<v-sheet color="white" height="67%" width="100%" rounded="t-xl" class="d-flex flex-row justify-center">
				<div id="game" style="width: 98%; height: 98%; margin-top: auto; margin-bottom: auto"></div>
			</v-sheet>
		<v-sheet height="30%" width="100%" class="d-flex mt-auto flex-row">
			<v-sheet height="100%" width="67%" elevation="6" class="mt-auto" rounded="bl-xl">
				<ProfileCardMatchHistoryDialog v-if="loaded" :max_height="'80%'" :user="user" :stats="stats" />
			</v-sheet>
			<v-sheet elevation="6" height="100%" width="30%" class="ml-auto" rounded="br-xl">
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
import P5 from "p5";
import {sketch} from "@/game/gameMain";

@Component({
	components: {ProfileCardMatchHistoryDialog, HomeContentOnlineList},
	props: {
		user: Object
	},
	data: () => ({
		canvas: Object,
		stats: {},
		loaded: false,
		game: false,
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
	mounted() {
		this.loadStats()
		setTimeout(() => {
			this.$data.canvas = new P5(sketch);
		}, 1000)
	},
	destroyed() {
		delete this.$data.canvas
	},
	created() {
		console.log("proute")
	}
})
export default class HomeContent extends Vue {
}
</script>

<style scoped>
</style>
