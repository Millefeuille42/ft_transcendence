<template>
	<v-sheet width="30%" height="100%">
		<v-sheet color="white" width="100%" height="15%"></v-sheet>
		<v-sheet width="100%" height="75%" color="white" class="overflow-y-auto" >
			<ProfileCustomizeInventoryRow :numOfElements=3 />
			<ProfileCustomizeInventoryRow :numOfElements=3 />
			<ProfileCustomizeInventoryRow :numOfElements=3 />
			<ProfileCustomizeInventoryRow :numOfElements=1 />
		</v-sheet>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ProfileCustomizeInventoryRow
	from "@/components/ProfileContentAddons/ProfileCustomizeAddon/ProfileCustomizeInventoryRow.vue";

@Component({
	components: {ProfileCustomizeInventoryRow}
})
export default class ProfileCustomizeInventorySheet extends Vue {
}
</script>

<style scoped>

</style>
