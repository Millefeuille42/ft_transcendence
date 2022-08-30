<template>
	<v-container fill-height class="align-content-start text-left">
		<v-img color="transparent" height="0%" :src=user.banner align="center"></v-img>
		<v-row style="height: 100%">
			<v-col cols="3" style="height: 100%">
				<ChatNavDrawer :loaded="loaded" :user=user></ChatNavDrawer>
			</v-col>
			<v-col style="height: 100%">
				<ChatMainWindow v-if="loaded"></ChatMainWindow>
				<SkeletonChatMainWindow v-if="!loaded"></SkeletonChatMainWindow>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ChatNavDrawer from "@/components/ChatContentAddons/ChatNavDrawer.vue";
import ChatMainWindow from "@/components/ChatContentAddons/ChatMainWindow.vue";
import ProfileContent from "@/components/ProfileContent.vue";
import ProfileCard from "@/components/ProfileContentAddons/ProfileCard.vue";
import SkeletonChatMainWindow from "@/components/SkeletonComponents/SkeletonChatMainWindow.vue";

@Component({
	components: {SkeletonChatMainWindow, ProfileCard, ProfileContent, ChatMainWindow, ChatNavDrawer},
	props: {
		user: Object,
		loaded: Boolean,
		loggedIn: Boolean
	}
})
export default class ChatContent extends Vue {
}
</script>

<style scoped>

</style>
