import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: '/',
      meta: {
        isAuth: true
      }
    },
    {
      path: '/opTicket',
      name: 'op编辑页',
      component: () => import('./components/OpTicket.vue'),
      meta: {
        isAuth: true
      }
    },
    {
      path: '/city',
      name: '城市弹窗',
      component: () => import('./components/SelectCities.vue'),
      meta: {
        isAuth: true
      }
    }
  ]
})