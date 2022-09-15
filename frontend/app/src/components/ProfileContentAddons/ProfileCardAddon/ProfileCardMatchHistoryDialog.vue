<template>
	<v-card height="100%" elevation="0" :rounded="is_rounded ? 'xl' : 'false'"
			class="overflow-hidden"
			max-height="40vh">
		<v-card-title>{{  user.username + "'s match history" }}</v-card-title>
		<v-divider/>
		<v-card-text v-if="hasHistory" :style="'max-height: ' + max_height + ';'" class="overflow-y-auto">
			<v-sheet width="100%" class="d-flex flex-column overflow-y-auto" color="transparent">
					<v-sheet v-for="match in stats.history" :key="match.key"
							 width="100%" height="100%"
							 :class="'d-flex flex-row justify-space-around mt-2 mb-2 text-truncate' +
							 ($vuetify.breakpoint.mobile ? '' : ' text-h6')
							">
						<v-sheet :color="userVictory(match) ? 'grey darken-3' : 'grey darken-4'" width="40%" height="100%"
								 class="d-flex flex-row" :elevation="userVictory(match) ? 10 : 2">
							<v-sheet :color="userVictory(match) ? 'grey darken-3' : 'grey darken-4'"
									 class="text-left pa-2 ml-2" width="50%" height="100%">
								{{ user.username}}
							</v-sheet>
							<v-sheet :color="userVictory(match) ? 'grey darken-3' : 'grey darken-4'"
									 class="text-right pa-2 mr-2" width="50%" height="100%">
								{{ match.userPoints}}
							</v-sheet>
						</v-sheet>
						<v-sheet width="10%" height="100%"
								 :class="'text-center pa-2' +
								($vuetify.breakpoint.mobile ? '' : ' text-h5')">
							VS
						</v-sheet>
						<v-sheet :color="!userVictory(match) ? 'grey darken-3' : 'grey darken-4'" width="40%" height="100%"
								 class="d-flex flex-row" :elevation="!userVictory(match) ? 10 : 2">
							<v-sheet :color="!userVictory(match) ? 'grey darken-3' : 'grey darken-4'"
									 class="text-left pa-2 ml-2" width="50%" height="100%">
								{{ match.rivalPoints}}
							</v-sheet>
							<v-sheet :color="!userVictory(match) ? 'grey darken-3' : 'grey darken-4'"
									 class="text-right pa-2 mr-2" width="50%" height="100%">
								{{ match.rival}}
							</v-sheet>
						</v-sheet>
					</v-sheet>
			</v-sheet>
		</v-card-text>
		<v-card-text v-else class="mt-4">
			You don't have participated in any match
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {match} from "@/queriesData";

@Component({
	props: {
		user: Object,
		stats: Object,
		is_rounded: {
			type: Boolean,
			default: true
		},
		max_height: {
			type: String,
			default: "35vh"
		}
	},
	data: () => ({
		loaded: false,
		hasHistory: false,
	}),
	methods: {
		userVictory(match: match): Boolean {
			return match.rivalPoints < match.userPoints
		}
	},
	mounted() {
		this.$data.hasHistory = this.$props.stats.history != undefined
			&& this.$props.stats.history.length > 0
		for (let matchIndex in this.$props.stats.history) {
			this.$props.stats.history[matchIndex].key = matchIndex
		}
	}
})
export default class ProfileCardMatchHistoryDialog extends Vue {
}
</script>

<style scoped>

</style>
