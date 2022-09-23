<template>
	<v-sheet v-if="currentChan !== '' && owner" height="10%" class="mx-4 d-flex flex-row justify-space-around align-center">
		<v-btn @click="showDialog = true">Settings</v-btn>
		<v-dialog v-model="showDialog" dark width="50%">
			<v-sheet width="100%" class="mt-6 pa-4 d-flex flex-column align-center">
				<v-sheet width="80%" class="d-flex flex-row align-center" color="transparent">
					<v-checkbox
						v-model="createPublic"
						hide-details
						class="shrink mr-2 mt-0"
						label="Public"
					></v-checkbox>
				</v-sheet>
				<v-sheet width="80%" class="d-flex flex-row align-center" color="transparent">
					<v-checkbox
						v-model="createHasPassword"
						hide-details
						class="shrink mr-2 mt-0"
					></v-checkbox>
					<v-text-field
						:style="'width: 50%;'"
						:disabled="!createHasPassword || createPublic"
						label="Password"
						v-model="createPasswordPrompt"
					></v-text-field>
				</v-sheet>
				<v-btn @click="handleSend" class="mr-auto ml-auto"> send </v-btn>
			</v-sheet>
		</v-dialog>
	</v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {editPrivacy} from "@/queries";
import {EventBus} from "@/main";

@Component({
	props: {
		login: String,
		currentChan: String,
		owner: Boolean,
	},
	data: () => ({
		showDialog: false,
		createPublic: false,
		createHasPassword: false,
		createPasswordPrompt: "",
	}),
	methods: {
		handleSend() {
			console.log(this.$props.currentChan)
			if (this.$data.createHasPassword && this.$data.createPasswordPrompt === "") {
				EventBus.$emit("chatSnack", "Invalid password", "red")
			}
			let pass = this.$data.createHasPassword ? this.$data.createPasswordPrompt : undefined
			editPrivacy(this.$props.currentChan, this.$props.login, this.$data.createPublic, pass).catch((e) => {
				if (e.response) {
					EventBus.$emit("chatSnack", e.response.data.message, "red")
				}
			})
		}
	}
})
export default class ChatPrivacyDialog extends Vue {
}
</script>

<style scoped>

</style>
