import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import axios from 'axios';

Vue.config.productionTip = false

Vue.prototype.$axios = axios;

new Vue({
  vuetify,
  router,
  render: h => h(App),
  created() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
}).$mount('#app')
