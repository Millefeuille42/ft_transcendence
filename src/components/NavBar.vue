<template>
	<nav>
		<img id="logo" alt="logo" src="@/assets/logo.png"/>
		<NavLink url="/login" text="Login"/>
		<NavLink url="/" text="Home"/>
	</nav>
</template>

<script lang="ts">
import NavLink from "@/components/NavLink.vue";
import {Component, Vue} from "vue-property-decorator";

@Component({
	components: {
		NavLink
	}
})
export default class NavBar extends Vue {}
</script>

<style scoped>
</style>
