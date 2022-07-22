<template>
	<div id="app">
		<v-app id="inspire">
			<AppBar :Links=links />
			<v-main class="grey lighten-3">
				<v-container>
					<v-row>
						<DisplayContainer cols="12" sm="2" min_height="268">
							<ProfileContent :small=true></ProfileContent>
						</DisplayContainer>

						<DisplayContainer cols="12" sm="8" min_height="70vh">
							<ProfileContent :small=false></ProfileContent>
						</DisplayContainer>

						<DisplayContainer cols="12" sm="2" min_height="286">
						</DisplayContainer>
					</v-row>
				</v-container>
			</v-main>
		</v-app>
	</div>
</template>

<style>
html {
	overflow: hidden !important;
	scrollbar-width: none;
	-ms-overflow-style: none;
}

html::-webkit-scrollbar {
	width: 0;
	height: 0;
}

</style>

<script lang="ts">
import {EventBus} from "@/main";
import {Component, Vue} from "vue-property-decorator";
import AppBar from "@/components/AppBar.vue";
import DisplayContainer from "@/components/DisplayContainer.vue";
import ProfileContent from "@/components/ProfileContent.vue";

@Component( {
	components: {DisplayContainer, AppBar, ProfileContent},
	data: () => ({
		links: [
			'Home',
			'Play',
			'Chat',
			'Profile',
		],
	}),
})
export default class App extends Vue {}
</script>
