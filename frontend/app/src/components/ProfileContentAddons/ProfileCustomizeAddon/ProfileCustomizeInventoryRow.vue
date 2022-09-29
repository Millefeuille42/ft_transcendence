<template>
	<v-sheet width="100%" :height=heightOfRow color="grey darken-4"
			 class="d-flex justify-space-around align-center flex-wrap">
		<ProfileCustomizeInventoryElement
			v-for="element in elements" :key="element.id + element.category"
			:item="element" :category="element.category"
		/>
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
		elements: Array,
	},
})
export default class ProfileCustomizeInventoryRow extends Vue {
}
</script>

<style scoped>

</style>
