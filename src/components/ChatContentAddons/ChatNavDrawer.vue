<template>
	<v-navigation-drawer v-model="drawer" height="100%" style="border-radius: 20px" permanent>
		<v-container>
			<SkeletonChatProfileCard v-if="!loaded"></SkeletonChatProfileCard>
			<ChatProfileCard v-if="loaded" :user=user></ChatProfileCard>
		</v-container>
		<v-divider></v-divider>
		<v-treeview :items="items" open-all hoverable v-model="tree" open-on-click item-key="name" class="text-left">
			<template v-slot:prepend="{ item }">
				<v-icon>{{ item.icon }}</v-icon>
			</template>
		</v-treeview>
	</v-navigation-drawer>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ChatProfileCard from "@/components/ChatContentAddons/ChatProfileCard.vue";
import SkeletonChatProfileCard from "@/components/SkeletonComponents/SkeletonChatProfileCard.vue";

@Component({
	components: {SkeletonChatProfileCard, ChatProfileCard},
	//TODO better profile card
	props: {
		user: Object,
		loaded: Boolean,
	},
	data: () => ({
		drawer: null,
		tree: [],
		items: [
			{
				id: 1,
				name: "Channels",
				icon: "mdi-forum-outline",
				children: [
					{ id: 2, name: 'General' },
					{ id: 3, name: 'Random' },
					{ id: 4, name: 'Transcendence' },
				]
			},
			{
				id: 5,
				name: "Private Messages",
				icon: "mdi-message-lock-outline",
				children: [
					{ id: 6, name: 'ericard' },
					{ id: 7, name: 'tefroiss' },
				]
			}
		]
	})
})
export default class ChatNavDrawer extends Vue {
}
</script>

<style scoped>

</style>
