import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import firebase from "firebase";
import store from "./store";
import "./assets/app.css";
import "./assets/detail.css";
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

var config = {
  apiKey: "AIzaSyDJHsM8uebVGFqn6HFh4sq2YsKXgkA2-qc",
  authDomain: "missioncompanyshare.firebaseapp.com",
  databaseURL: "https://missioncompanyshare.firebaseio.com",
  projectId: "missioncompanyshare",
  storageBucket: "missioncompanyshare.appspot.com",
  messagingSenderId: "661427674665",
  appId: "1:661427674665:web:1f7263900ecaf665290638",
  measurementId: "G-QLE6N9Z7NZ"
};
firebase.initializeApp(config);
new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
