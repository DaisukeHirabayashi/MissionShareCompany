<template>
  <div class="finder">
    <template v-if="this.loading">
      <vue-loading
        type="balls"
        color="#333"
        :size="{ width: '50px', height: '50px' }"
      ></vue-loading>
    </template>
    <template v-else>
      <v-container class="mx-auto text-left p-3">
        <h3 class="p-3">検索結果</h3>
        <a>{{ keyword }}の検索結果を表示しています</a>
        <template v-if="filteredCompanys == '' && filteredSubCompanys == ''">
          <a>お探しの企業は見つかりませんでした</a>
        </template>
        <!--Firebase から取得したリストを描画（トランジション付き）-->
        <v-list two-line subheader shaped>
          <v-subheader>COMPANYS</v-subheader>
          <v-list-item-group color="primary">
            <v-list-item
              v-for="{
                name,
                key,
                prefecture,
                address,
                url,
                phonenumber
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
                    select: 'main-company'
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
        <v-list two-line subheader shaped>
          <v-subheader>SUBCOMPANYS</v-subheader>
          <v-list-item-group color="primary">
            <v-list-item
              v-for="{
                name,
                key,
                prefecture,
                address,
                url,
                phonenumber
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
                    select: 'sub-company'
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
</template>

<script>
// firebase モジュール
import firebase from "firebase";
import { mapState, mapMutations } from "vuex";
import { COMPANY_UPDATE } from "../store/mutation-types";
import { VueLoading } from "vue-loading-template";

export default {
  name: "finder",
  components: {
    VueLoading
  },
  data() {
    return {
      keyword: this.$store.state.findcompany,
      picked: "main",
      user: {}, // ユーザー情報
      companys: [], // 取得した本社を入れる配列
      subCompanys: [],
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
      }
    });
  },
  computed: {
    selectAll: {
      get: function() {
        //authorsのチェックボックスのすべてにチェックが入ったかを判定
        if (this.checkNames.length == this.prefectures.length) {
          return true; //authorsにすべてチェックを入れるとselectAllはtrueとなりチェックが入る
        } else {
          return false;
        }
      },
      set: function(value) {
        //全選択のチェックボックスを操作した場合
        //空の配列を用意
        let checkArray = [];

        //チェックが入った場合（trueでの判定）
        if (value) {
          this.prefectures.forEach(function(prefecture) {
            checkArray.push(prefecture);
          });
        }
        this.checkNames = checkArray;
      }
    },
    filteredCompanys: function() {
      var filterCompanys = [];

      for (var i in this.companys) {
        var company = this.companys[i];
        if (company.name.indexOf(this.keyword) !== -1) {
          filterCompanys.push(company);
        }
      }
      return filterCompanys;
    },
    filteredSubCompanys: function() {
      var filterSubCompanys = [];

      for (var i in this.subCompanys) {
        var subCompany = this.subCompanys[i];
        if (subCompany.name.indexOf(this.keyword) !== -1) {
          filterSubCompanys.push(subCompany);
        }
      }
      return filterSubCompanys;
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
      COMPANY_UPDATE
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
    subChildAdded(snap) {
      const subCompany = snap.val();
      this.subCompanys.push({
        key: snap.key,
        name: subCompany.name,
        prefecture: subCompany.prefecture,
        address: subCompany.address,
        url: subCompany.url,
        phonenumber: subCompany.phonenumber,
        main_com_id: subCompany.main_com_id
      });
      this.scrollBottom();
    },
    sendDetail() {
      document.location.href = "./detail";
    },
    companySend(str) {
      this.COMPANY_UPDATE(str); //会社情報を詳細画面に送る
      this.sendDetail();
    }
  }
};
</script>
