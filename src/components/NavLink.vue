<template>
  <a :href='url'>{{ text }}</a>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({
	props: {
		url: String,
		text: String
	}
})
export default class NavLink extends Vue {}

</script>

<style scoped>

</style>
