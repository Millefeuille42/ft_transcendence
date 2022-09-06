<template>
	<v-card>
		<v-card-title>Click to unblock</v-card-title>
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
import {getBlockedList, removeBlock} from "@/queries";
import {blockedListIn} from "@/queriesData";
import {EventBus} from "@/main";

@Component({
	props: {
		user: Object,
	},
	data: () => ({
		loaded: false,
		blockedList: Array,
		loadingBlocking: false,

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
		loadBlockedList() {
			this.$data.loaded = false
			getBlockedList(this.$props.user.login)
				.then((blockedList: blockedListIn[]) => {
					this.$data.blockedList = blockedList
					this.$data.loaded = true
				}).catch((e) => {
					console.log(e)
			})
		},
		handleUnblock(block: string) {
			this.$data.loadingBlocking = true
			removeBlock(this.$props.user.login, block)
				.then(() => {
					EventBus.$emit("updateOnlineList", "")
					this.showSnack(block + " unblocked", "green")
					this.$data.loadingBlocking = false
					this.loadBlockedList()
				})
				.catch(() => {
					this.showSnack("Error while unblocking " + block, "red")
					this.$data.loadingBlocking = false
				})
		}
	},
	mounted() {
		this.loadBlockedList()
	}
})
export default class ProfileSettingsBlockedList extends Vue {
}
</script>

<style scoped>

</style>
