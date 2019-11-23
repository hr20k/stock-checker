import 'vue-croppa/dist/vue-croppa.css'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ja'
import moment from 'vue-moment'
import VueLodash from 'vue-lodash'
import Croppa from 'vue-croppa'
import VueMuuri from 'vue-muuri'
import 'vue-muuri/dist/vue-muuri.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(ElementUI, { locale })
Vue.use(moment)
Vue.use(VueLodash)
Vue.use(Croppa)
Vue.use(VueMuuri)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
