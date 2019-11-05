<template>
  <div class="home">
    <div id="app">
      <header class="header">
        <h1>インターン情報サイト</h1>
        <!-- ログイン時にはフォームとログアウトボタンを表示 -->
        <div v-if="user.uid" key="login">
          [{{ user.displayName }}]
          <button type="button" @click="doLogout">ログアウト</button>
        </div>
        <!-- 未ログイン時にはログインボタンを表示 -->
        <div v-else key="logout">
          <button type="button" @click="doLogin">ログイン</button>
        </div>
      </header>

      <!--Firebase から取得したリストを描画（トランジション付き）-->
      <transition-group name="company" tag="div" class="list content">
        <section
          v-for="{ key, name, day, place, feel } in companys"
          :key="key"
          class="item"
        >
          <router-link
            to="./detail"
            @click.native="companySend({ key, name, day, place, feel })"
            >{{ name }}</router-link
          >
          <button type="button" @click="deleteCompany(key)">削除</button>
        </section>
      </transition-group>
    </div>
  </div>
</template>

<script>
// firebase モジュール
import firebase from "firebase";
import { mapState, mapMutations } from "vuex";
import { COMPANY_UPDATE } from "../store/mutation-types";
export default {
  name: "home",
  data() {
    return {
      user: {}, // ユーザー情報
      companys: [], // 取得したメッセージを入れる配列
      input: "" // 入力したメッセージ
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {};
      const companyData = firebase.database().ref("company");
      if (user) {
        this.companys = [];
        // company に変更があったときのハンドラを登録
        companyData.limitToLast(100).on("child_added", this.childAdded);
      } else {
        // company に変更があったときのハンドラを解除
        companyData.limitToLast(100).off("child_added", this.childAdded);
      }
    });
  },
  methods: {
    // スクロール位置を一番下に移動
    // ログイン処理
    doLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider);
    },
    ...mapMutations({
      COMPANY_UPDATE
    }),
    // ログアウト処理
    doLogout() {
      firebase.auth().signOut();
      location.reload();
    },
    scrollBottom() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.clientHeight);
      });
    },
    // 受け取ったメッセージをcompanysに追加
    // データベースに新しい要素が追加されると随時呼び出される
    childAdded(snap) {
      const company = snap.val();
      this.companys.push({
        key: snap.key,
        day: company.day,
        feel: company.feel,
        place: company.place,
        name: company.name
      });
      this.scrollBottom();
    },
    deleteCompany(key) {
      firebase
        .database()
        .ref("company/" + key)
        .set({}); //会社情報の削除
      firebase
        .database()
        .ref("comment/" + key)
        .set({}); //ある会社に対するコメントの削除
      location.reload();
    },
    companySend(str) {
      this.COMPANY_UPDATE(str); //会社情報を詳細画面に送る
    }
  }
};
</script>
