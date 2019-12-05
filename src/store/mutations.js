import * as types from "./mutation-types"; //mutation-typesをImportします
import firebase from "firebase";

export const state = {
  company: [],
  maincompanykey: [],
  editcompany: [],
  findcompany: ""
};

export const mutations = {
  [types.COMPANY_UPDATE](state, payload) {
    state.company = payload;
  },
  [types.KEY_UPDATE](state, payload) {
    state.maincompanykey = payload;
  },
  [types.COMPANY_EDIT](state, payload) {
    state.editcompany = payload;
  },
  [types.COMPANY_FIND](state, payload) {
    state.findcompany = payload;
  }
};
