import Vue from "vue";
import Vuex from "vuex";
import * as actions from "./actions";
import * as getters from "./getters";
import { state, mutations } from "./mutations";
import firebase from "firebase";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  firebase,
  actions,
  getters,
  state,
  mutations,
  plugins: [createPersistedState({ storage: window.sessionStorage })] // オプションを追加
});
