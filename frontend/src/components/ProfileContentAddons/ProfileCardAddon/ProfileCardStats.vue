<template>
	<v-sheet color="transparent">
		<v-row>
			<v-col> {{"Wins: " + stats.wins}} </v-col>
			<v-col> {{"Losses: " + stats.looses}} </v-col>
			<v-col> {{"Win Rate: " + wr}} </v-col>
		</v-row>
		<v-row>
			<v-sheet color="transparent" width="80%" class="ml-auto mr-auto">
				<v-divider/>
			</v-sheet>
		</v-row>
		<v-row>
			<v-col> {{"Total games: " + stats.total}} </v-col>
			<v-col> {{"Gacha Points: " + stats.points}} </v-col>
		</v-row>
		<v-row>
			<v-sheet color="transparent" width="80%" class="ml-auto mr-auto">
				<v-divider/>
			</v-sheet>
		</v-row>
		<v-row>
			<v-col> {{"Last rival: " + stats.lastRival}} </v-col>
			<v-col>
				<v-btn color="transparent" @click="showDialog = true">
					See match history
				</v-btn>
			</v-col>
		</v-row>
		<v-dialog v-model="showDialog" dark>
			<ProfileCardMatchHistoryDialog :user="user"/>
		</v-dialog>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {statsIn} from "@/queriesData";
import ProfileCardMatchHistoryDialog
	from "@/components/ProfileContentAddons/ProfileCardAddon/ProfileCardMatchHistoryDialog.vue";

@Component({
	components: {ProfileCardMatchHistoryDialog},
	props: {
		stats: Object as () => statsIn,
		user: Object
	},
	data: () => ({
		wr: Number,
		showDialog: false
	}),
	mounted() {
		if (this.$props.stats.total === 0) {
			this.$data.wr = 0
			return
		}
		this.$data.wr = this.$props.stats.wins / this.$props.stats.total
	}
})
export default class ProfileCardStats extends Vue {
}
</script>

<style scoped>

</style>
