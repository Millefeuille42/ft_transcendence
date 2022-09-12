<template>
	<v-sheet color="transparent" height="100%" width="100%" class="d-flex flex-column justify-space-around" >
		<v-sheet color="transparent" width="80%" height="30%" class="d-flex flex-row justify-space-around ml-auto mr-auto">
			<v-col> {{"Wins: " + stats.wins}} </v-col>
			<v-col> {{"Losses: " + stats.looses}} </v-col>
			<v-col> {{"Win Rate: " + wr}} </v-col>
		</v-sheet>
		<v-row>
			<v-sheet color="transparent" width="80%" class="ml-auto mr-auto">
				<v-divider/>
			</v-sheet>
		</v-row>
		<v-sheet color="transparent" width="80%" height="30%" class="d-flex flex-row justify-space-around ml-auto mr-auto">
			<v-col> {{"Total games: " + stats.total}} </v-col>
			<v-col> {{"Gacha Points: " + stats.points}} </v-col>
		</v-sheet>
		<v-row>
			<v-sheet color="transparent" width="80%" class="ml-auto mr-auto">
				<v-divider/>
			</v-sheet>
		</v-row>
		<v-sheet color="transparent" width="80%" height="30%" class="d-flex flex-row justify-space-around ml-auto mr-auto">
			<v-sheet color="transparent" class=""> {{"Last rival: " + stats.lastRival}} </v-sheet>
			<v-sheet color="transparent" v-if="dialog">
				<v-btn color="transparent" @click="showDialog = true">
					See match history
				</v-btn>
			</v-sheet>
		</v-sheet>
		<v-dialog v-if="dialog" v-model="showDialog" dark :width="$vuetify.breakpoint.mobile ? '100%' : '40%'">
			<ProfileCardMatchHistoryDialog :is_rounded="false" :user="user" :stats="stats"/>
		</v-dialog>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ProfileCardMatchHistoryDialog
	from "@/components/ProfileContentAddons/ProfileCardAddon/ProfileCardMatchHistoryDialog.vue";

@Component({
	components: {ProfileCardMatchHistoryDialog},
	props: {
		stats: Object,
		user: Object,
		dialog: {
			type: Boolean,
			default: true
		}
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
