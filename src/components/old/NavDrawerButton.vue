<template>
	<v-app-bar-nav-icon @click.stop="emitClickEvent()"></v-app-bar-nav-icon>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {EventBus} from "@/main";

@Component({
	data: () => ({
		drawer: false,
		group: null,
	}),

	watch: {
		group () {
			this.$data.drawer = false
		},
	},
	methods: {
		emitClickEvent() {
			this.$data.drawer = true
			EventBus.$emit('click', this.$data.drawer)
		}
	}
})
export default class NavDrawerButton extends Vue {}
</script>

<style scoped>

</style>
