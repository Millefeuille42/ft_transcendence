<template>
	<v-sheet color="grey" width="100%" :height=heightOfRow
			 class="d-flex justify-space-around align-center">
		<ProfileCustomizeInventoryElement v-for="n in numOfElements" :key=n />
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ProfileCustomizeInventoryElement
	from "@/components/ProfileContentAddons/ProfileCustomizeAddon/ProfileCustomizeInventoryElement.vue";

@Component({
	components: {ProfileCustomizeInventoryElement},
	props: {
		heightOfRow: String,
		numOfElements: Number,
	},
})
export default class ProfileCustomizeInventoryRow extends Vue {
}
</script>

<style scoped>

</style>
