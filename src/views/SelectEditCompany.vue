<template>
  <div class="selectedit">
    <div id="app">
      <template v-if="this.loading">
        <vue-loading
          type="balls"
          color="#333"
          :size="{ width: '50px', height: '50px' }"
        ></vue-loading>
      </template>
      <template v-else>
        <v-container class="mx-auto text-left p-3">
          <h3 class="p-3">編集用ページ</h3>
          <!--Firebase から取得したリストを描画（トランジション付き）-->
          <template v-if="filteredCompanys == '' && filteredSubCompanys == ''">
            <a>あなたが登録した企業は見つかりませんでした</a>
          </template>
          <template v-else>
            <h4>本社</h4>
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
                  } in filteredCompanys"
                >
                  <v-list-item-content
                    @click="
                      companySend({
                        key,
                        name,
                        prefecture,
                        address,
                        url,
                        phonenumber,
                        user_id,
                        type
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

            <!--Firebase から取得したリストを描画（支社）-->
            <h4>支社</h4>
            <v-list two-line subheader shaped>
              <v-subheader>SUBCOMPANYS</v-subheader>
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
                  } in filteredSubCompanys"
                >
                  <v-list-item-content
                    @click="
                      companySend({
                        key,
                        name,
                        prefecture,
                        address,
                        url,
                        phonenumber,
                        user_id,
                        type
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
          </template>
        </v-container>
      </template>
    </div>
  </div>
</template>

<script>
// firebase モジュール
import firebase from "firebase";
import { mapState, mapMutations } from "vuex";
import { COMPANY_EDIT } from "../store/mutation-types";
import { VueLoading } from "vue-loading-template";
export default {
  name: "selectedit",
  components: {
    VueLoading
  },
  data() {
    return {
      user: {}, // ユーザー情報
      companys: [], // 取得した本社を入れる配列
      subCompanys: [],
      input: "", // 入力したメッセージ
      loading: true
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {};
      const companyData = firebase.database().ref("main-company");
      const subCompanyData = firebase.database().ref("sub-company");
      if (user) {
        this.companys = [];
        this.subCompanys = [];
        // company に変更があったときのハンドラを登録
        companyData.limitToLast(100).on("child_added", this.childAdded);
        subCompanyData.limitToLast(100).on("child_added", this.subChildAdded);
      } else {
        // company に変更があったときのハンドラを解除
        companyData.limitToLast(100).off("child_added", this.childAdded);
        subCompanyData.limitToLast(100).off("child_added", this.subChildAdded);
      }
    });
  },
  computed: {
    filteredCompanys: function() {
      var filterCompanys = [];
      var user_uid = this.user.uid;
      for (var i in this.companys) {
        var company = this.companys[i];
        if (user_uid == company.user_id) {
          filterCompanys.push(company);
        }
      }
      return filterCompanys;
    },
    filteredSubCompanys: function() {
      var filterCompanys = [];
      var user_uid = this.user.uid;
      for (var i in this.subCompanys) {
        var company = this.subCompanys[i];
        if (user_uid == company.user_id) {
          filterCompanys.push(company);
        }
      }
      return filterCompanys;
    }
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  },
  methods: {
    // スクロール位置を一番下に移動
    ...mapMutations({
      COMPANY_EDIT
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
        phonenumber: company.phonenumber,
        user_id: company.user_id,
        type: "main-company"
      });
      this.scrollBottom();
    },
    subChildAdded(snap) {
      const subCompany = snap.val();
      this.subCompanys.push({
        key: snap.key,
        name: subCompany.name,
        prefecture: subCompany.prefecture,
        address: subCompany.address,
        url: subCompany.url,
        phonenumber: subCompany.phonenumber,
        main_com_id: subCompany.main_com_id,
        user_id: subCompany.user_id,
        type: "sub-company"
      });
      this.scrollBottom();
    },
    sendDetail() {
      document.location.href = "./companyedit";
    },
    companySend(str) {
      this.COMPANY_EDIT(str); //会社情報を詳細画面に送る
      this.sendDetail();
    }
  }
};
</script>
