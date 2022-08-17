<template>
	<v-sheet class="mx-auto" max-width="100%" align="center" color="transparent">
		<v-row class="pa-5">
			<v-col cols="12">
				<v-avatar class="profile" size="64">
					<v-img :src=user.avatar></v-img>
				</v-avatar>
			</v-col>
			<v-col class="py-0">
				<v-list-item dark>
					<v-list-item-content>
						<v-list-item-title class="text-h6">{{ user.username }}</v-list-item-title>
						<v-list-item-subtitle>{{ user.status }}</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</v-col>
		</v-row>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({
	props: {
		user: Object,
	},
})
export default class ChatProfileCard extends Vue {
}
</script>

<style scoped>

</style>
