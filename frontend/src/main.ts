import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueCookies from 'vue-cookies-ts'
export const EventBus = new Vue();

Vue.config.productionTip = false
Vue.use(VueCookies)

new Vue({
  el: '#app',
// @ts-ignore
  vuetify: vuetify,
// @ts-ignore
  VueCookies: VueCookies,
  render: h => h(App)
}).$mount('#app')
