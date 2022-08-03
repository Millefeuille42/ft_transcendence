import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
export const EventBus = new Vue();

Vue.config.productionTip = false

new Vue({
  el: '#app',
// @ts-ignore
  vuetify: vuetify,
  render: h => h(App)
}).$mount('#app')
