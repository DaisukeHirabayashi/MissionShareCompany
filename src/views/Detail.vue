<template>
  <v-app>
    <div class="detail">
      <template v-if="this.loading">
        <vue-loading
          type="balls"
          color="#333"
          :size="{ width: '50px', height: '50px' }"
        ></vue-loading>
      </template>
      <template v-else>
        <v-container class="mx-auto text-left p-3 ">
          <h1>{{ company.name }}</h1>
          <v-list>
            <v-subheader
              >DETAILS<span v-for="key in this.averageRate">
                <v-icon small color="yellow">star</v-icon> </span
              ><template v-if="this.chat.length > 0"
                >({{ this.chat.length }})</template
              ></v-subheader
            >
            <v-layout wrap class="ml-4">
              <v-list-item-icon>
                <v-icon class="headline">mdi-domain</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  class="headline"
                  v-text="company.name"
                ></v-list-item-title>
              </v-list-item-content>
            </v-layout>
            <v-layout wrap class="ml-4">
              <v-list-item-icon>
                <v-icon>public</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  v-text="company.prefecture"
                ></v-list-item-title>
              </v-list-item-content>
            </v-layout>
            <v-layout wrap class="ml-4">
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="company.address"></v-list-item-title>
              </v-list-item-content>
            </v-layout>
            <v-layout wrap class="ml-4">
              <v-list-item-icon>
                <v-icon>mdi-phone</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  v-text="company.phonenumber"
                ></v-list-item-title>
              </v-list-item-content>
            </v-layout>
            <v-layout wrap class="ml-4">
              <v-list-item-icon>
                <v-icon>language</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <a href="#" @click="moveUrl(company.url)">{{ company.url }}</a>
              </v-list-item-content>
            </v-layout>
          </v-list>
          <v-list>
            <div
              v-if="this.ratingUser[0].answer == 'yes'"
              class="mx-auto text-left p-3"
            >
              <div class="headline">説明会に行った人向け<br /></div>
              <div class="p-3">
                就職後この地方で働けますか?
                <v-btn small depressed disabled color="primary">はい</v-btn>
                <v-btn
                  small
                  depressed
                  color="error"
                  @click="
                    updateVoting(
                      'no',
                      company.key,
                      ratingUser[0].key,
                      company.select
                    )
                  "
                  >いいえ</v-btn
                >
              </div>
            </div>
            <div
              v-else-if="this.ratingUser[0].answer == 'no'"
              class="mx-auto text-left p-3"
            >
              <div class="headline">説明会に行った人向け<br /></div>
              <div class="p-3">
                就職後この地方で働けますか?
                <v-btn
                  small
                  depressed
                  color="primary"
                  @click="
                    updateVoting(
                      'yes',
                      company.key,
                      ratingUser[0].key,
                      company.select
                    )
                  "
                  >はい</v-btn
                >
                <v-btn small depressed disabled color="error">いいえ</v-btn>
              </div>
            </div>
            <template v-else>
              <div class="headline">説明会に行った人向け<br /></div>
              <div class="p-3">
                就職後この地方で働けますか?
                <v-btn
                  small
                  depressed
                  color="primary"
                  @click="voting('yes', company.key, company.select)"
                  >はい</v-btn
                >
                <v-btn
                  small
                  depressed
                  color="error"
                  @click="voting('no', company.key, company.select)"
                  >いいえ</v-btn
                >
              </div>
            </template>
            <div class="headline ml-4">みんなの意見<br /></div>
            <div class="p-3 ml-4">
              {{ this.manyAnswer[0].text }}(はい:{{
                this.manyAnswer[0].yes
              }},いいえ:{{ this.manyAnswer[0].no }})
            </div>
          </v-list>
        </v-container>
        <v-container>
          <v-card class="p-3 text-left bg-lighten-4-blue">
            <h2>レビュー</h2>
            <!--Firebase から取得したリストを描画（トランジション付き）-->
            <v-window class="elevation-1" :vertical="false" :show-arrows="true">
              <v-window-item
                v-for="{
                  key,
                  name,
                  image,
                  message,
                  companykey,
                  ratings,
                  submitDay
                } in reverseChats"
                :key="key"
              >
                <v-card flat>
                  <v-card-text>
                    <v-row class="m-4" align="end">
                      <!-- <v-avatar color="grey" class="mr-4"></v-avatar> -->
                      <strong class="title ml-5">{{ name }}</strong>
                      <v-spacer>(投稿日:{{ submitDay }})</v-spacer>
                      <v-btn icon class="mr-5">
                        <span v-for="key in ratings">
                          <v-icon small color="yellow">star</v-icon>
                        </span>
                      </v-btn>
                    </v-row>

                    <v-row class="m-4">
                      <p class="ml-5">
                        {{ message }}
                      </p>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-window-item>
            </v-window>
          </v-card>
        </v-container>
        <v-container>
          <v-card>
            <v-toolbar flat color="blue-grey" dark>
              <v-toolbar-title>Submit a post</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-textarea
                filled
                label="Text"
                placeholder="コメントを残す"
                v-model="input"
              ></v-textarea>
              <v-rating v-model="rating" color="yellow"></v-rating>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="success" depressed @click="doSend(company.key)">
                Post
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </template>
    </div>
  </v-app>
</template>
<script>
import { mapState } from "vuex";
import firebase from "firebase";
import Nl2br from "vue-nl2br";
import { VueLoading } from "vue-loading-template";
export default {
  components: { Nl2br, VueLoading },
  data() {
    return {
      user: {}, // ユーザー情報
      chat: [], // 取得したメッセージを入れる配列
      ratingUser: [
        {
          key: "",
          answer: "",
          name: ""
        }
      ],
      ratings: [],
      loading: true,
      input: "", // 入力したメッセージ
      rating: 3,
      answer: "",
      companyData: [],
      oneCompany: [],
      companykey: this.$store.state.company.key
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {};
      this.chat = [];
      this.ratings = [];
      const ref_message = firebase
        .database()
        .ref("comment/" + this.$store.state.company.key);
      const ref_ratings_user = firebase
        .database()
        .ref("ratings/" + this.$store.state.company.key + "/" + this.user.uid);
      const ref_rating_company = firebase
        .database()
        .ref(this.$store.state.company.select);
      ref_message.limitToLast(100).on("child_added", this.childAdded);
      ref_ratings_user
        .limitToLast(100)
        .on("child_added", this.childRatingUserAdded);
      ref_rating_company
        .limitToLast(100)
        .on("child_added", this.childCompanyAdded);
    });
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  },
  computed: {
    ...mapState({
      company: "company"
    }),
    reverseChats() {
      return this.chat.slice().reverse();
    },
    averageRate: function() {
      var sum = 0;
      if (this.chat.length <= 0) {
        return 3;
      }
      this.chat.forEach(function(value) {
        sum = sum + value.ratings;
      });
      return Math.round(sum / this.chat.length);
    },
    manyAnswer: function() {
      var companykey = this.companykey;
      var voteitems = [{ yes: 0, no: 0, text: "", rateKey: "" }];
      if (this.companyData == null) {
        return 0;
      } else {
        this.companyData.forEach(function(value) {
          if (value.yes == null) {
          } else if (companykey == value.key) {
            voteitems[0].yes = value.yes;
            voteitems[0].no = value.no;
            voteitems[0].rateKey = value.key;
          }
        });
        if (voteitems[0].yes == 0 && voteitems[0].no == 0) {
          voteitems[0].text = "まだ投票されていません";
          return voteitems;
        }
        if (voteitems[0].yes > voteitems[0].no) {
          voteitems[0].text = "この地方で働ける可能性が高いです";
          return voteitems;
        }
        voteitems[0].text = "この地方では働けない可能性が高いです";
        return voteitems;
      }
    },
    today: function() {
      var today = new Date();
      return (
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate()
      );
    }
  },
  methods: {
    childAdded(snap) {
      const message = snap.val();
      this.chat.push({
        key: snap.key,
        name: message.name,
        image: message.image,
        message: message.message,
        companykey: message.companykey,
        ratings: message.ratings,
        submitDay: message.submitDay
      });
    },
    childRatingUserAdded(snap) {
      const rates = snap.val();
      this.ratingUser = [
        {
          key: snap.key,
          answer: rates.answer,
          name: rates.name
        }
      ];
    },
    childCompanyAdded(snap) {
      const company = snap.val();
      this.companyData.push({
        key: snap.key,
        yes: company.yes,
        no: company.no
      });
    },
    doSend(sendkey) {
      if (this.user.uid && this.input.length) {
        // firebase にメッセージを追加
        firebase
          .database()
          .ref("comment/" + sendkey)
          .push(
            {
              message: this.input,
              name: this.user.displayName,
              image: this.user.photoURL,
              companykey: sendkey,
              ratings: this.rating,
              user: this.user.uid,
              submitDay: this.today
            },
            () => {
              this.input = ""; // フォームを空にする
            }
          );
      }
    },
    voting(str, sendkey, select) {
      this.answer = str;
      firebase
        .database()
        .ref("ratings/" + sendkey + "/" + this.user.uid)
        .push({
          answer: this.answer,
          name: this.user.displayName
        });
      if (str == "yes") {
        firebase
          .database()
          .ref(select)
          .child(sendkey)
          .update({
            yes: this.manyAnswer[0].yes + 1
          });
      } else {
        firebase
          .database()
          .ref(select)
          .child(sendkey)
          .update({
            no: this.manyAnswer[0].no + 1
          });
      }
      const ref_rating_company = firebase.database().ref(select);
      ref_rating_company
        .limitToLast(100)
        .on("child_added", this.childCompanyAdded);
      this.ratingUser[0].answer = str;
    },
    updateVoting(str, companykey, key, select) {
      firebase
        .database()
        .ref("ratings/" + companykey + "/" + this.user.uid)
        .child(key)
        .update({
          answer: str
        });
      if (str == "yes") {
        firebase
          .database()
          .ref(select)
          .child(this.manyAnswer[0].rateKey)
          .update({
            yes: this.manyAnswer[0].yes + 1,
            no: this.manyAnswer[0].no - 1
          });
      } else {
        firebase
          .database()
          .ref(select)
          .child(this.manyAnswer[0].rateKey)
          .update({
            yes: this.manyAnswer[0].yes - 1,
            no: this.manyAnswer[0].no + 1
          });
      }
      const ref_rating_company = firebase.database().ref(select);
      ref_rating_company
        .limitToLast(100)
        .on("child_added", this.childCompanyAdded);
      this.ratingUser[0].answer = str;
    },
    moveUrl(url) {
      document.location.href = url;
    }
  }
};
</script>

<style scoped>
.bg-lighten-4-blue {
  background-color: #bbdefb;
}
</style>
