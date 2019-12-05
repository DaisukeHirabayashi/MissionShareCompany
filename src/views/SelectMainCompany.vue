<template>
  <div class="home">
    <div id="app">
      <template v-if="this.loading">
        <vue-loading
          type="balls"
          color="#333"
          :size="{ width: '50px', height: '50px' }"
        ></vue-loading>
      </template>
      <template v-else>
        <v-container v-if="!user.uid">
          <h3 class="p-3">まずは右上のボタンからログイン!</h3>
        </v-container>
        <v-container v-else class="mx-auto text-left p-3">
          <h3 class="p-3">本社選択</h3>
          <!--Firebase から取得したリストを描画（トランジション付き）-->
          <v-list two-line subheader shaped>
            <v-subheader>COMPANYS</v-subheader>
            <v-list-item-group color="primary">
              <v-list-item
                v-for="{
                  key,
                  name,
                  prefecture,
                  address,
                  url,
                  phonenumber,
                  user_id,
                  type
                } in companys"
              >
                <v-list-item-content
                  @click="
                    keySend({
                      key,
                      name
                    })
                  "
                >
                  <v-list-item-title
                    style="text-align: left;"
                    class="ml-4"
                    v-text="prefecture"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    style="text-align: left;"
                    class="ml-4"
                    v-text="name"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-container>
      </template>
    </div>
  </div>
</template>

<script>
// firebase モジュール
import firebase from "firebase";
import { mapState, mapMutations } from "vuex";
import { KEY_UPDATE } from "../store/mutation-types";
import { VueLoading } from "vue-loading-template";
export default {
  name: "selectmaincompany",
  components: {
    VueLoading
  },
  data() {
    return {
      checkNames: [],
      loading: true,
      user: {}, // ユーザー情報
      companys: [], // 取得したメッセージを入れる配列
      input: "" // 入力したメッセージ
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {};
      const companyData = firebase.database().ref("main-company");
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
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  },
  methods: {
    // スクロール位置を一番下に移動
    ...mapMutations({
      KEY_UPDATE
    }),
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
        name: company.name,
        prefecture: company.prefecture,
        address: company.address,
        url: company.url,
        phonenumber: company.phonenumber
      });
      this.scrollBottom();
    },
    sendDetail() {
      document.location.href = "./subregister";
    },
    keySend(key) {
      this.KEY_UPDATE(key); //会社情報を詳細画面に送る
      this.sendDetail();
    }
  }
};
</script>
