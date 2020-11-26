import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
// import router from './router.vue'

import loading from "./components/toolTip";
Vue.use(loading);

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  // router,
  render: h => h(App),
}).$mount('#app')
