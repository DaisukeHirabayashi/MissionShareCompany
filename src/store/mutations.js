import * as types from "./mutation-types"; //mutation-typesをImportします
import firebase from "firebase";

export const state = {
  company: []
};

export const mutations = {
  [types.COMPANY_UPDATE](state, payload) {
    state.company = payload;
  }
};
