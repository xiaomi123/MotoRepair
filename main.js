import Vue from 'vue'
import App from './App'
import http from './common/js/http.js'
import api from './common/js/api.js'
import check from './common/js/common.js'
import tabBar from "./components/tabBar/tabBar.vue"
import uniIcons from './components/uni-icons/uni-icons.vue'

Vue.component('tabBar', tabBar)
Vue.component('uni-icons', uniIcons)

Vue.config.productionTip = false
Vue.prototype.$http = http
Vue.prototype.$api = api
Vue.prototype.$check = check

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
