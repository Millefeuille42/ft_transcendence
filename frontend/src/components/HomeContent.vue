<template>
	<v-container fill-height class="d-flex flex-column pa-6">
			<v-sheet color="black" height="67%" width="100%" rounded="t-xl">
			</v-sheet>
		<v-sheet height="30%" width="100%" class="d-flex mt-auto flex-row">
			<v-sheet color="grey" height="100%" width="67%" class="mt-auto" rounded="bl-xl">
				"history"
			</v-sheet>
			<v-sheet elevation="6" height="100%" width="30%" class="ml-auto" rounded="br-xl">
				<HomeContentOnlineList :user="user"/>
			</v-sheet>
		</v-sheet>

	</v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import HomeContentOnlineList from "@/components/HomeContentAddons/HomeContentOnlineList.vue";

@Component({
	components: {HomeContentOnlineList},
	props: {
		user: Object
	}
})
export default class HomeContent extends Vue {
}
</script>

<style scoped>
</style>
