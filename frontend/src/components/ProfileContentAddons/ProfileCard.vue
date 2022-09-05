<template>
	<v-sheet v-if="loadedCard" elevation="3" class="mx-auto"
			 :max-width="mWidth" min-width="80%" :height="height" :rounded="rounded">
		<!--suppress HtmlDeprecatedAttribute -->
		<v-img height="100%" width="100%" :src="user.banner" align="center"
			   class=""
			   :style="rounded === 'xl' ? 'border-radius: 20px' : ''">
			<v-sheet elevation="5" color="rgb(0, 0, 0, 0.2)"
					 :max-height="$vuetify.breakpoint.mobile ? '200px' : ''"
					 style="backdrop-filter: blur(13px); -webkit-backdrop-filter: blur(13px)"
					 :class=" ($vuetify.breakpoint.mobile ? 'mt-3 d-flex flex-column justify-center' : 'mt-7')"
					 width="75%" max-width="24em" rounded="xl"
					:height="$vuetify.breakpoint.mobile ? '80%' : ''"
			>
				<v-row v-if="!$vuetify.breakpoint.mobile" class="pa-5">
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
				<v-sheet color="transparent" width="100%" height="100%" v-else
					class="d-flex flex-column justify-center"
				>
					<v-avatar class="profile mr-auto ml-auto" size="80">
						<v-img :src=user.avatar></v-img>
					</v-avatar>
				</v-sheet>
			</v-sheet>
			<TransparentCard v-if="height === '100%'" class="mt-8">
				<v-skeleton-loader v-if="!loaded" type="paragraph, text@3"/>
				<ProfileCardStats v-else :stats="stats" :user="user"/>
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
		mWidth: String,
		rounded: {
			type: String,
			default: "xl"
		}
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
		this.$data.loaded = false
		getUserStats(this.$props.user.login)
			.then((stats: statsIn) => {
				this.$data.stats = stats
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
