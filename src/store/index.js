import Vue from "vue";
import Vuex from "vuex";
import * as actions from "./actions";
import * as getters from "./getters";
import { state, mutations } from "./mutations";
import firebase from "firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  firebase,
  actions,
  getters,
  state,
  mutations
});
