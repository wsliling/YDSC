import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false
import G_show_modal from './components/G_show_modal/g_show_modal.js'
Vue.use(G_show_modal)
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
