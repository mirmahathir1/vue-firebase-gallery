import App from './App.vue'
import router from './router'
import store from './store'

import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import firebase from 'firebase';
import keys from './key';

console.log(keys);

var firebaseConfig = keys;

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

// And import Bootstrap and BootstrapVue css files:

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
