<template>
	<v-tab>{{ Title }}</v-tab>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {EventBus} from "@/main";

@Component({
	props: {
		Title: String,
		Id: String,
	},
})
export default class TopBarTab extends Vue {}
</script>

<style scoped>

</style>
