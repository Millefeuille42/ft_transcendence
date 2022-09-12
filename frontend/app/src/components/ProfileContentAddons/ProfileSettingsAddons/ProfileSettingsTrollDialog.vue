<template>
	<v-card width="100%">
		<v-card-title> Are you sure? </v-card-title>
		<v-card-text> This will result in permanent deletion of your account </v-card-text>
		<v-card-actions>
			<v-btn text color="red" @click="sure = true" > Yes </v-btn>
			<v-btn text color="green" @click="handleNo" > No </v-btn>
		</v-card-actions>
		<v-dialog v-model="sure" width="20%" dark>
			<v-card>
				<v-card-title> Are you really sure? </v-card-title>
				<v-card-text> This will result in permanent deletion of your account </v-card-text>
				<v-card-actions>
					<v-btn text color="green" @click="sureTwo = true" > Yes </v-btn>
					<v-btn text color="red" @click="handleNo" > No </v-btn>
				</v-card-actions>
				<v-dialog v-model="sureTwo" width="20%" dark>
					<v-card>
						<v-card-title> Are you REALLY sure? </v-card-title>
						<v-card-text> like, for real? </v-card-text>
						<v-card-actions>
							<v-btn text color="red" @click="sureThree = true" > Yo </v-btn>
							<v-btn text color="green" @click="handleNo" > Nes </v-btn>
						</v-card-actions>
						<v-dialog v-model="sureThree" width="20%" dark>
							<v-card>
								<v-card-title> Fine... </v-card-title>
								<v-card-text> Good luck with that </v-card-text>
								<v-card-actions>
									<v-btn text color="grey darken-4" @click="handleNo" > No </v-btn>
									<v-btn text color="grey darken-4" @click="handleSuccess" > Yes </v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-card>
				</v-dialog>
			</v-card>
		</v-dialog>
	</v-card>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({
	methods: {
		handleNo() {
			this.$data.sure = false
			this.$data.sureTwo = false
			this.$data.sureThree = false
			this.$emit("no")
		},
		handleSuccess() {
			this.$data.sure = false
			this.$data.sureTwo = false
			this.$data.sureThree = false
			this.$emit("yes")
		}
	},
	data: () => ({
		sure: false,
		sureTwo: false,
		sureThree: false
	})
})
export default class ProfileSettingsTrollDialog extends Vue {
}
</script>

<style scoped>

</style>
