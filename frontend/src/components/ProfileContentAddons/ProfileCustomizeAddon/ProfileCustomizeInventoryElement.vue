<template>
	<v-sheet width="30%" height="80%" color="transparent" class="mt-4">
		<v-img :alt="item.name" :title="item.name" contain width="100%" height="100%"
			   :src="loadImage()">
			<v-btn color="transparent" width="100%" height="100%" @click="handleClick">
			</v-btn>
		</v-img>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {inventoryItem} from "@/queriesData";
import {EventBus} from "@/main";

@Component({
	props: {
		item: Object as () => inventoryItem,
		category: String
	},
	methods: {
		handleClick() {
			EventBus.$emit("itemChanged", this.$props.item)
		},
		loadImage():string {
			let address: string = this.$props.category === 'sound' ? '/sound.png' : this.$props.item.description
			console.log(address)
			return address
		}
	}
})
export default class ProfileCustomizeInventoryElement extends Vue {
}
</script>

<style scoped>

</style>
