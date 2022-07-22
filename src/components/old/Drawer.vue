<template>
	<v-navigation-drawer
		v-model="drawer"
		absolute
		bottom
		temporary
	>
		<v-list
			nav
			dense
		>
			<v-list-item-group
				v-model="group"
			>
				<v-list-item>
					<v-list-item-title>Login</v-list-item-title>
				</v-list-item>

				<v-list-item>
					<v-list-item-title>Play</v-list-item-title>
				</v-list-item>

				<v-list-item>
					<v-list-item-title>Forum</v-list-item-title>
				</v-list-item>
			</v-list-item-group>
		</v-list>
	</v-navigation-drawer>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {EventBus} from "@/main";

@Component({
	data: () => ({
		drawer: false,
		toggled: false,
		group: null,
	}),
	watch: {
		group () {
			this.$data.drawer = false
		},
	},

	created() {
		EventBus.$on("click", (drawer: boolean) => {
			this.$data.drawer = drawer
		})
	}
})
export default class Drawer extends Vue {}

</script>

<style scoped>

</style>
