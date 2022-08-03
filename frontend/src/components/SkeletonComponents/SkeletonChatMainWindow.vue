<template>
	<v-container fill-height class="align-content-end ">
		<v-container class="overflow-y-auto mt-5 pb-0 pt-0" style="max-height: 90%" height="50%">
			<v-list two-line>
				<template v-for="n in 6">
					<SkeletonChatMessage :objKey="n" />
					<v-divider
						v-if="n !== 6"
						:key="`divider-${n}`"
						inset
					></v-divider>
				</template>
			</v-list>
		</v-container>
		<v-text-field class="mt-4 align-end"
					  label="Message"
					  outlined
					  dense
		></v-text-field>
	</v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import SkeletonChatMessage from "@/components/SkeletonComponents/SkeletonChatMessage.vue";

@Component({
	components: {SkeletonChatMessage}
})
export default class SkeletonChatMainWindow extends Vue {
}
</script>

<style scoped>

</style>
