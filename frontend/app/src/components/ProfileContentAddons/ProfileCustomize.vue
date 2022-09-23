<template>
	<v-sheet width="100%" height="100%">
		<v-sheet width="100%" height="90%" class="d-flex justify-space-around" color="">
			<ProfileCustomizeInventorySheet v-if="!load" :login="user.login" category="ball" heightOfRow="25%"/>
			<ProfileCustomizeInventorySheet v-if="!load" :login="user.login" category="rod" heightOfRow="35%"/>
		</v-sheet>
		<v-sheet width="100%" height="10%" class="mt-2 d-flex row justify-center">
			<v-btn :loading="loadingButton" class="ml-2" @click="saveItem"> Save </v-btn>
		</v-sheet>
		<v-snackbar v-model="snackShow" :color="snackColor" timeout="2000" > {{ snackText }} </v-snackbar>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ProfileCustomizeInventorySheet
	from "@/components/ProfileContentAddons/ProfileCustomizeAddon/ProfileCustomizeInventorySheet.vue";
import {equipItem} from "@/queries";
import {inventoryItem} from "@/queriesData";
import {EventBus} from "@/main";

interface selectedComponent {
	cat: String
	selected: inventoryItem
}

@Component({
	components: {ProfileCustomizeInventorySheet},
	props: {
		user: Object,
	},
	data: () => ({
		load: false,
		loadingButton: false,
		sel: [{cat: "ball", selected: {name: ""}}, {cat: "rod", selected: {name: ""}}, {cat: "sound", selected: {name: ""}}],
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
		async saveItem() {
			this.$data.loadingButton = true
			try {
				for (let i in this.$data.sel) {
					if (this.$data.sel[i].selected.name === "") {
						continue
					}
					await equipItem(this.$props.user.login, this.$data.sel[i].selected)
				}
			}
			catch {
				// TODO handle properly
				this.showSnack("Failed to save loadout", "red")
				return
			}
			this.showSnack("Loadout successfully saved", "green")
			this.$data.loadingButton = false
		},
	},
	created() {
		EventBus.$on("itemChanged", (item: inventoryItem) => {
			let id = this.$data.sel.findIndex((it: selectedComponent) => it.cat === item.category)
			this.$data.sel[id].selected = item
		})
	}
})
export default class ProfileCustomize extends Vue {
}
</script>

<style scoped>

</style>
