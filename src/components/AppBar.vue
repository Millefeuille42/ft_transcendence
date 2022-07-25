<template>
	<v-app-bar app flat>
		<NavTabs class="" :Links=Links></NavTabs>
		<v-spacer></v-spacer>
		<v-avatar color="grey darken-1 shrink" size="32">
			<v-img :src=user.profilePic></v-img>
		</v-avatar>
	</v-app-bar>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import NavTabs from "@/components/NavTabs.vue";

@Component({
	components: {
		NavTabs
	},
	props: {
		user: Object,
		Links: Array
	}
})
export default class AppBar extends Vue {
}
</script>

<style scoped>

</style>
