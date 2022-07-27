<template>
	<v-container fill-height class="d-flex flex-column align-center justify-center">
		<ProfileCard :user=user></ProfileCard>
		<ProfileDataContainer class="mb-auto mt-8">
			<ProfileForm :user=user></ProfileForm>
		</ProfileDataContainer>
		<ProfileBottomDrawer/>
	</v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ProfileCard from "@/components/ProfileContentAddons/ProfileCard.vue";
import ProfileForm from "@/components/ProfileContentAddons/ProfileForm.vue";
import ProfileDataContainer from "@/components/ProfileContentAddons/ProfileDataContainer.vue";
import ProfileBottomDrawer from "@/components/ProfileContentAddons/ProfileBottomDrawer.vue";

@Component({
	components: {ProfileBottomDrawer, ProfileDataContainer, ProfileForm, ProfileCard},
	//TODO send user data to api
	props: {
		user: Object
	}
})
export default class ProfileContent extends Vue {
}
</script>

<style scoped>

</style>
