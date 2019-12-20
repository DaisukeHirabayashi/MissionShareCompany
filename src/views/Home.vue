<template>
  <div class="home">
    <div id="app">
      <template v-if="this.loading">
        <vue-loading
          type="balls"
          color="#333"
          :size="{ width: '10%', height: '10%' }"
        ></vue-loading>
      </template>
      <template v-else>
        <v-carousel
          cycle
          height="600"
          hide-delimiter-background
          show-arrows-on-hover
        >
          <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.src">
            <v-container fill-height>
              <v-layout align-center>
                <v-flex>
                  <div class="box">
                    <div>
                      <h3 class="display-3 p3">会社情報サイト</h3>
                      <p>
                        <span class="subheading"
                          >その会社で働くことができるかどうかをユーザー同士で共有するサイトです</span
                        >
                      </p>
                    </div>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-carousel-item>
        </v-carousel>
        <v-container v-if="!user.uid">
          <h3 class="p-3">まずは右上のボタンからログイン!</h3>
        </v-container>
        <v-container v-else>
          <h3 class="p-3" v-if="isMain">本社用検索ページ</h3>
          <h3 class="p-3" v-else>支社用検索ページ</h3>
          <v-row class="mt-5 mx-5">
            <v-col>
              <v-select
                v-model="checkNames"
                :items="prefectures"
                label="Select"
                multiple
                chips
                hint="都道府県絞り込み"
                persistent-hint
              ></v-select>
            </v-col>
          </v-row>
          <v-row class="mx-5 mb-5" justify="start">
            <v-col cols="6">
              <v-checkbox v-model="selectAll" label="select all"></v-checkbox>
            </v-col>
            <v-col cols="6">
              <v-switch
                v-model="isMain"
                label="本社、支社の切り替え"
                color="red"
                hide-details
              ></v-switch>
            </v-col>
          </v-row>
          <v-row class="mt-5 mx-5">
            <v-col>
              <v-select
                v-model="selectAreas"
                :items="areas"
                label="Select"
                multiple
                chips
                hint="地方絞り込み"
                persistent-hint
              ></v-select>
            </v-col>
          </v-row>
          <!--Firebase から取得したリストを描画（トランジション付き）-->
          <template v-if="isMain">
            <v-alert type="warning" v-if="filteredCompanys.length <= 0">
              表示する結果がありません。
            </v-alert>
            <v-list v-else two-line subheader shaped>
              <v-subheader>本社</v-subheader>
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
          </template>
          <!--Firebase から取得したリストを描画（支社）-->
          <template v-if="!isMain">
            <v-alert type="warning" v-if="filteredSubCompanys.length <= 0">
              表示する結果がありません。
            </v-alert>
            <v-list v-else two-line subheader shaped>
              <v-subheader>支社</v-subheader>
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
          </template>
        </v-container>
        <v-footer class="font-weight-medium">
          <v-col class="text-center" cols="12">
            {{ new Date().getFullYear() }} — <strong>Job Serch</strong>
          </v-col>
        </v-footer>
      </template>
    </div>
  </div>
</template>
<style>
.box {
  padding-top: 20px;
  padding-bottom: 10px;
  font-weight: bold;
  color: #6091d3; /*文字色*/
  background: #fff;
  border: solid 3px #6091d3; /*線*/
  border-radius: 10px; /*角の丸み*/
}
</style>
<script>
// firebase モジュール
import firebase from "firebase";
import { mapState, mapMutations } from "vuex";
import { COMPANY_UPDATE } from "../store/mutation-types";
import { VueLoading } from "vue-loading-template";

export default {
  components: {
    VueLoading
  },
  name: "home",
  data() {
    return {
      isMain: true,
      loading: true,
      areas: [
        "北海道地方",
        "東北地方",
        "関東地方",
        "中部地方",
        "近畿地方",
        "中国・四国地方",
        "九州地方"
      ],
      selectAreas: [],
      checkNames: [
        "北海道",
        "青森県",
        "岩手県",
        "宮城県",
        "秋田県",
        "山形県",
        "福島県",
        "茨城県",
        "栃木県",
        "群馬県",
        "埼玉県",
        "千葉県",
        "東京都",
        "神奈川県",
        "新潟県",
        "富山県",
        "石川県",
        "福井県",
        "山梨県",
        "長野県",
        "岐阜県",
        "静岡県",
        "愛知県",
        "三重県",
        "滋賀県",
        "京都府",
        "大阪府",
        "兵庫県",
        "奈良県",
        "和歌山県",
        "鳥取県",
        "島根県",
        "岡山県",
        "広島県",
        "山口県",
        "徳島県",
        "香川県",
        "愛媛県",
        "高知県",
        "福岡県",
        "佐賀県",
        "長崎県",
        "熊本県",
        "大分県",
        "宮崎県",
        "鹿児島県",
        "沖縄県"
      ],
      headers: [
        {
          text: "Company",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "都道府県", value: "prefecture" }
      ],
      items: [
        {
          src: require("../assets/homePhotos/page1.jpg")
        },
        {
          src: require("../assets/homePhotos/page2.jpg")
        },
        {
          src: require("../assets/homePhotos/page3.jpg")
        }
      ],
      prefectures: [
        "北海道",
        "青森県",
        "岩手県",
        "宮城県",
        "秋田県",
        "山形県",
        "福島県",
        "茨城県",
        "栃木県",
        "群馬県",
        "埼玉県",
        "千葉県",
        "東京都",
        "神奈川県",
        "新潟県",
        "富山県",
        "石川県",
        "福井県",
        "山梨県",
        "長野県",
        "岐阜県",
        "静岡県",
        "愛知県",
        "三重県",
        "滋賀県",
        "京都府",
        "大阪府",
        "兵庫県",
        "奈良県",
        "和歌山県",
        "鳥取県",
        "島根県",
        "岡山県",
        "広島県",
        "山口県",
        "徳島県",
        "香川県",
        "愛媛県",
        "高知県",
        "福岡県",
        "佐賀県",
        "長崎県",
        "熊本県",
        "大分県",
        "宮崎県",
        "鹿児島県",
        "沖縄県"
      ],
      user: {}, // ユーザー情報
      companys: [], // 取得した本社を入れる配列
      subCompanys: [],
      input: "" // 入力したメッセージ
    };
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
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
      this.selectAll.set;
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
      var areaPrefecture = [];
      var checkPrefecture = [];
      this.checkNames.forEach(function(pref) {
        checkPrefecture.push(pref);
      });
      this.selectAreas.forEach(function(area) {
        if (area == "北海道地方") {
          areaPrefecture.push("北海道");
        } else if (area == "東北地方") {
          areaPrefecture.push(
            "青森県",
            "岩手県",
            "宮城県",
            "秋田県",
            "山形県",
            "福島県"
          );
        } else if (area == "関東地方") {
          areaPrefecture.push(
            "茨城県",
            "栃木県",
            "群馬県",
            "埼玉県",
            "千葉県",
            "東京都",
            "神奈川県"
          );
        } else if (area == "中部地方") {
          areaPrefecture.push(
            "新潟県",
            "富山県",
            "石川県",
            "福井県",
            "山梨県",
            "長野県",
            "岐阜県",
            "静岡県",
            "愛知県"
          );
        } else if (area == "近畿地方") {
          areaPrefecture.push(
            "三重県",
            "滋賀県",
            "京都府",
            "大阪府",
            "兵庫県",
            "奈良県",
            "和歌山県"
          );
        } else if (area == "中国・四国地方") {
          areaPrefecture.push(
            "鳥取県",
            "島根県",
            "岡山県",
            "広島県",
            "山口県",
            "徳島県",
            "香川県",
            "愛媛県",
            "高知県"
          );
        } else if (area == "九州地方") {
          areaPrefecture.push(
            "福岡県",
            "佐賀県",
            "長崎県",
            "熊本県",
            "大分県",
            "宮崎県",
            "鹿児島県",
            "沖縄県"
          );
        }
      });
      areaPrefecture.forEach(function(prefecture) {
        var result = checkPrefecture.indexOf(prefecture);
        if (result < 0) {
          checkPrefecture.push(prefecture);
        }
      });
      for (var i in this.companys) {
        var company = this.companys[i];
        checkPrefecture.forEach(function(prefecture) {
          if (prefecture == company.prefecture) {
            filterCompanys.push(company);
          }
        });
      }
      return filterCompanys;
    },
    filteredSubCompanys: function() {
      var filterCompanys = [];
      var areaPrefecture = [];
      var checkPrefecture = [];
      this.checkNames.forEach(function(pref) {
        checkPrefecture.push(pref);
      });
      this.selectAreas.forEach(function(area) {
        if (area == "北海道地方") {
          areaPrefecture.push("北海道");
        } else if (area == "東北地方") {
          areaPrefecture.push(
            "青森県",
            "岩手県",
            "宮城県",
            "秋田県",
            "山形県",
            "福島県"
          );
        } else if (area == "関東地方") {
          areaPrefecture.push(
            "茨城県",
            "栃木県",
            "群馬県",
            "埼玉県",
            "千葉県",
            "東京都",
            "神奈川県"
          );
        } else if (area == "中部地方") {
          areaPrefecture.push(
            "新潟県",
            "富山県",
            "石川県",
            "福井県",
            "山梨県",
            "長野県",
            "岐阜県",
            "静岡県",
            "愛知県"
          );
        } else if (area == "近畿地方") {
          areaPrefecture.push(
            "三重県",
            "滋賀県",
            "京都府",
            "大阪府",
            "兵庫県",
            "奈良県",
            "和歌山県"
          );
        } else if (area == "中国・四国地方") {
          areaPrefecture.push(
            "鳥取県",
            "島根県",
            "岡山県",
            "広島県",
            "山口県",
            "徳島県",
            "香川県",
            "愛媛県",
            "高知県"
          );
        } else if (area == "九州地方") {
          areaPrefecture.push(
            "福岡県",
            "佐賀県",
            "長崎県",
            "熊本県",
            "大分県",
            "宮崎県",
            "鹿児島県",
            "沖縄県"
          );
        }
      });
      areaPrefecture.forEach(function(prefecture) {
        var result = checkPrefecture.indexOf(prefecture);
        if (result < 0) {
          checkPrefecture.push(prefecture);
        }
      });
      for (var i in this.subCompanys) {
        var company = this.subCompanys[i];
        checkPrefecture.forEach(function(prefecture) {
          if (prefecture == company.prefecture) {
            filterCompanys.push(company);
          }
        });
      }
      return filterCompanys;
    }
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
