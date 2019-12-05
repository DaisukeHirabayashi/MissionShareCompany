<template>
  <div id="app">
    <v-app-bar app clipped-left color="amber">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <!-- 検索機能を今後つけたようにおいてあります -->
      <span class="title ml-3 mr-5"
        ><div class="linkbox">
          <a href="/"></a>
          <p>Job&nbsp;<span class="font-weight-light">Search</span></p>
        </div></span
      >
      <v-text-field
        solo-inverted
        flat
        hide-details
        @keydown.enter="serchCompany"
        label="Search"
        v-model="keyword"
      />
      <span v-if="user.uid">
        <v-btn class="ml-3 mr-5" outlined color="green" @click="serchCompany"
          >検索</v-btn
        >
      </span>
      <v-spacer />
      <span v-if="user.uid" key="login">
        <button type="button" @click="doLogout" class="btn-square-so-pop">
          ログアウト
        </button>
      </span>
      <!-- 未ログイン時にはログインボタンを表示 -->
      <span v-else key="logout">
        <button type="button" @click="doLogin" class="btn-square-so-pop">
          ログイン
        </button>
      </span>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app clipped color="grey lighten-4">
      <v-list dense class="grey lighten-4">
        <template v-for="(item, i) in items">
          <v-row v-if="item.heading" :key="i" align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col cols="6" class="text-right">
              <v-btn small text>edit</v-btn>
            </v-col>
          </v-row>
          <v-divider v-else-if="item.divider" :key="i" dark class="my-4" />
          <v-list-item v-else :key="i" link :href="item.link">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <div id="nav"></div>
    <v-app>
      <router-view />
    </v-app>
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
#keep .v-navigation-drawer__border {
  display: none;
}
.btn-square-so-pop {
  position: relative;
  display: inline-block;
  padding: 0.25em 0.5em;
  text-decoration: none;
  color: #fff;
  background: #fd9535; /*色*/
  border-radius: 4px; /*角の丸み*/
  box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.2),
    inset 0 -2px 0 rgba(0, 0, 0, 0.05);
  font-weight: bold;
  border: solid 2px #d27d00; /*線色*/
}
.btn-square-so-pop:active {
  /*押したとき*/
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}
.linkbox {
  position: relative;
}
.linkbox a {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
.linkbox p {
  margin-bottom: 0;
}

/* 以下見た目をわかりやすくするための設定*/
.linkbox a:hover {
  /* マウスオーバー時に色変更*/
  opacity: 0.1;
  background-color: #000000;
}
</style>
<script>
import firebase from "firebase";
import { COMPANY_FIND } from "./store/mutation-types";
import { mapState, mapMutations } from "vuex";
import { VueLoading } from "vue-loading-template";
export default {
  data() {
    return {
      user: {},
      drawer: false,
      keyword: "",
      items: [
        { icon: "home", text: "Home", link: "/" },
        { icon: "add", text: "登録", link: "/register" },
        { icon: "add_box", text: "支社の登録", link: "/selectmaincompany" },
        { divider: true },
        { heading: "企業の方向け" },
        { icon: "edit", text: "編集", link: "/selectedit" },
        { icon: "delete", text: "削除", link: "/delete" },
        { divider: true }
      ]
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {};
    });
  },
  methods: {
    ...mapMutations({
      COMPANY_FIND
    }),
    doLogout() {
      firebase.auth().signOut();
      document.location.href = "./";
    },
    doLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider);
    },
    serchCompany(event) {
      if (event.keyCode != 13) {
      } else if (this.keyword == "") {
      } else {
        this.COMPANY_FIND(this.keyword);
        document.location.href = "./serchcompany";
      }
    }
  }
};
</script>
