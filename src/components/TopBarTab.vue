<template>
	<v-tab @click="updateTab(Id)">{{ Title }}</v-tab>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {EventBus} from "@/main";

@Component({
	props: {
		Title: String,
		Id: String,
	},
	methods: {
		updateTab(tab) {
			EventBus.$emit("tabChanged", tab)
		}
	}
})
export default class TopBarTab extends Vue {}
</script>

<style scoped>

</style>
