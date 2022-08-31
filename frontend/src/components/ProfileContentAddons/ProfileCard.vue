<template>
	<v-sheet v-if="loadedCard" elevation="3" class="mx-auto" max-width="100%" min-width="80%" :height="height" rounded="xl">
		<!--suppress HtmlDeprecatedAttribute -->
		<v-img height="100%" width="100%" :src="user.banner" align="center"
			   style="border-radius: 20px">
			<v-sheet elevation="5" color="rgb(0, 0, 0, 0.2)"
					 style="backdrop-filter: blur(13px); -webkit-backdrop-filter: blur(13px); margin-top: 24px"
					 width="75%" max-width="24em" rounded="xl">
				<v-row class="pa-5">
					<v-col cols="12">
						<v-avatar class="profile" size="80">
							<v-img :src=user.avatar></v-img>
						</v-avatar>
					</v-col>
					<v-col class="py-0">
						<v-list-item dark>
							<v-list-item-content>
								<v-list-item-title class="text-h6">{{ user.username }}</v-list-item-title>
								<v-list-item-subtitle>{{ user.status }}</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
					</v-col>
				</v-row>
			</v-sheet>
			<TransparentCard v-if="height === '100%'" class="mt-8">
				<v-skeleton-loader v-if="!loaded" type="paragraph, text@3"/>
				<ProfileCardStats v-else :stats="stats"/>
			</TransparentCard>
		</v-img>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {getUserStats} from "@/queries";
import {statsIn, userDataIn} from "@/queriesData";
import ProfileCardStats from "@/components/ProfileContentAddons/ProfileCardAddon/ProfileCardStats.vue";
import TransparentCard from "@/components/TransparentCard.vue";
import {EventBus} from "@/main";

@Component({
	components: {ProfileCardStats, TransparentCard},
	props: {
		user: Object as () => userDataIn,
		height: String,
	},
	data: () => ({
		stats: Object as () => statsIn,
		loaded: false,
		loadedCard: true,
	}),
	mounted() {
		if (this.$props.height != "100%") {
			return
		}
		let that = this
		this.$data.loaded = false
		getUserStats(this.$props.user.login)
			.then((stats: statsIn) => {
				that.$data.stats = stats
				this.$data.loaded = true
			})
			.catch((e) => {
				console.log(e)
			})
	},
	created() {
		EventBus.$on("userChangedDone", () => {
			this.$data.loadedCard = false
			setTimeout(() => {
				this.$data.loadedCard = true
			}, 100)
		})
	}
})
export default class ProfileCard extends Vue {
}
</script>

<style scoped>

</style>
