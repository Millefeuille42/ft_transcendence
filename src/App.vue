<template>
  	<div id="app">
		<NavBar/>
		<h1>PDF: Pong De Fou</h1>
  	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NavBar from "@/components/NavBar.vue";

@Component({
  components: {
	  NavBar
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">

body {
	margin: 0;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
}

#big-picture img {
	max-width: 100%;
	max-height: 100%;
	object-fit: contain;
}

</style>
