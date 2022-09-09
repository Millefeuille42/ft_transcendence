<template>
	<v-sheet width="30%" height="100%">
		<v-sheet color="grey darken-4" elevation="0" rounded="t-xl"
				 width="100%" height="15%" class="d-flex align-center">
			<v-container class="text-h6 text-truncate">
				<v-skeleton-loader v-if="currentItem.name === ''" type="text"/>
				{{ currentItem.name }}
			</v-container>
		</v-sheet>
		<v-sheet width="100%" height="75%"  rounded="b-xl" elevation="0"
				 color="grey darken-4" class="overflow-y-auto mt-4">
			<v-progress-circular v-if="!inventoryLoaded" indeterminate class="mt-16"/>
			<ProfileCustomizeInventoryRow v-else v-for="row in rows"
										  :key="row[0].name" :elements="row" :heightOfRow=heightOfRow />
		</v-sheet>
		<v-snackbar v-model="snackShow" :color="snackColor" timeout="2000" > {{ snackText }} </v-snackbar>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ProfileCustomizeInventoryRow
	from "@/components/ProfileContentAddons/ProfileCustomizeAddon/ProfileCustomizeInventoryRow.vue";
import { EventBus } from "@/main";
import {inventoryItem} from "@/queriesData";
import {getInventoryByCategory, getEquippedByCategory, RedirectToFTAuth} from "@/queries";

@Component({
	components: {ProfileCustomizeInventoryRow},
	props: {
		login: String,
		heightOfRow: String,
		category: String,
	},
	data: () => ({
		rows: [],
		inventoryLoaded: false,
		inventory: Array,
		currentItem: {name: ""} as () => inventoryItem,
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
		sortItems() {
			this.$data.rows = []
			let row: inventoryItem[] = []
			for (let index in this.$data.inventory) {
				if (!(row.find(i => i.name === this.$data.inventory[index].name)))
					row.push(this.$data.inventory[index])
			}
			this.$data.rows.push(row)
			this.$data.inventoryLoaded = true
		},

		async loadItems() {
			let that = this
			getInventoryByCategory(this.$props.login, this.$props.category)
				.then((inv: Array<inventoryItem>) => {
					that.$data.inventory = inv
					that.sortItems()
				})
				.catch((e) => {
					if (e.response.status >= 401 && e.response.status <= 404) {
						this.$cookies.remove("Session")
						RedirectToFTAuth()
						return
					}
					EventBus.$emit("down", "")
				})
		},

		async loadEquipment() {
			let that = this
			getEquippedByCategory(this.$props.login, this.$props.category)
				.then((inv: inventoryItem) => {
					that.$data.currentItem = inv
				})
				.catch((e) => {
					if (e.response.status >= 401 && e.response.status <= 404) {
						this.$cookies.remove("Session")
						RedirectToFTAuth()
						return
					}
					EventBus.$emit("down", "")
				})
		},
	},
	mounted() {
		this.loadEquipment()
		this.loadItems()
	},
	created() {
		EventBus.$on("itemChanged", (item: inventoryItem) => {
			if (this.$props.category === item.category) {
				this.$data.currentItem = item
			}
		})
	}
})
export default class ProfileCustomizeInventorySheet extends Vue {
}
</script>

<style scoped>

</style>
