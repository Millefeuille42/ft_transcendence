<template>
	<v-bottom-navigation v-model="bottomTab" dark shift
						 :absolute="$vuetify.breakpoint.mobile"
						 :width="$vuetify.breakpoint.mobile ? '100%' : '50%'">
		<v-btn>
			<span>Stats</span>
			<v-icon>mdi-chart-box</v-icon>
		</v-btn>

		<v-btn>
			<span>Customize</span>
			<v-icon>mdi-palette</v-icon>
		</v-btn>

		<v-btn>
			<span>Friends</span>
			<v-icon>mdi-account-group</v-icon>
		</v-btn>

		<v-btn>
			<span>Settings</span>
			<v-icon>mdi-cog</v-icon>
		</v-btn>
	</v-bottom-navigation>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {EventBus} from "@/main";

@Component({
	data: () => ({
		bottomTab: Number
	}),
	watch: {
		bottomTab () {
			EventBus.$emit("bottomTabChanged", this.$data.bottomTab)
		}
	}
})
export default class ProfileBottomDrawer extends Vue {}
</script>

<style scoped>

</style>
