<template>
	<v-sheet style="width: 100%; height: 100%" class="d-flex justify-space-between" color="">
		<ProfileCustomizeInventorySheet/>
		<ProfileCustomizeInventorySheet/>
		<ProfileCustomizeInventorySheet/>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ProfileCustomizeInventorySheet
	from "@/components/ProfileContentAddons/ProfileCustomizeAddon/ProfileCustomizeInventorySheet.vue";

@Component({
	components: {ProfileCustomizeInventorySheet}
})
export default class ProfileCustomize extends Vue {
}
</script>

<style scoped>

</style>
