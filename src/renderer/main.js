import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

import ElementUI from "element-ui"
Vue.use(ElementUI)

import "@/public/cssreset.css"
import "@/public/iconfonts/iconfont.css"
import "@/public/markdown.css"
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
