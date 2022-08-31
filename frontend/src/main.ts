import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueCookies from 'vue-cookies-ts'
export const EventBus = new Vue();
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client'

/* Establish Connection */
const socketConnection = SocketIO(process.env.VUE_APP_BACK_URL);

Vue.config.productionTip = false
Vue.use(VueCookies)

Vue.use(new VueSocketIO({
  debug: true,
  connection: socketConnection,
}))

new Vue({
  el: '#app',
// @ts-ignore
  vuetify: vuetify,
// @ts-ignore
  VueCookies: VueCookies,
  render: h => h(App)
}).$mount('#app')
