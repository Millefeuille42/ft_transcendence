<template>
	<v-sheet class="pa-5" width="90%" height="55%" rounded="xl" elevation="4" min-height="365px" min-width="150px">
		<slot></slot>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({})
export default class ProfileDataContainer extends Vue {
}
</script>

<style scoped>

</style>
