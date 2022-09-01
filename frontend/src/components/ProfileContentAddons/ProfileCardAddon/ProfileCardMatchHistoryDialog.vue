<template>
	<v-card>
		<v-card-title>{{  user.username + "'s match history" }}</v-card-title>
		<v-divider/>
		<v-card-text v-if="loaded && blockedList.thereIsBlocked" style="max-height: 300px;">
			<v-list-item  v-for="blocked in blockedList.listOfBlocked" :key="blocked" class="d-flex flex-row justify-space-between">
				<v-btn width="100%" height="20%" rounded :key="'btn-' + blocked" @click="handleUnblock(blocked)"
					   class="d-flex justify-center mb-2 mt-2 pl-4" color="grey darken-4">
					<v-list-item-content color="grey">
						<v-list-item-title class="text-center">{{ blocked }}</v-list-item-title>
					</v-list-item-content>
				</v-btn>
			</v-list-item>
		</v-card-text>
		<v-card-text v-else-if="loaded" class="mt-5">
			You don't have any blocked user
		</v-card-text>
		<v-snackbar v-model="snackShow" :color="snackColor" timeout="2000" > {{ snackText }} </v-snackbar>
	</v-card>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({
	props: {
		user: Object,
	},
	data: () => ({
		loaded: false,
		matchHistory: Array
	}),
	methods: {
		loadHistory() {

		}
	},
	mounted() {
		this.loadHistory()
	}
})
export default class ProfileCardMatchHistoryDialog extends Vue {
}
</script>

<style scoped>

</style>
