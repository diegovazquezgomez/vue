import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import '@mdi/font/css/materialdesignicons.css'
import axios from 'axios'


Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:3000/api/' // cambiar en produccion por localhost

new Vue({
  router,
  store,
  vuetify,
  icons: {
    iconfont: 'mdi', // default 
  },
  render: h => h(App)
}).$mount('#app')
