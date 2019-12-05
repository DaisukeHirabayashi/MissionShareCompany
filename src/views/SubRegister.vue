<template>
  <div class="subregister">
    <v-container v-if="!user.uid">
      <h3 class="p-3">まずは右上のボタンからログイン!</h3>
    </v-container>
    <v-container v-else class="mx-auto text-left p-3">
      <h1>支社登録ページ</h1>
      <h2>本社:{{ maincompanykey.name }}</h2>
      <Form :formData="formData[0]" />
      <form class="p-3">
        <v-card-title>都道府県</v-card-title>
        <v-select
          name="pref_name"
          v-model="prefecture"
          :items="prefectures"
          label="Prefecture"
          :rules="[v => !!v || 'Item is required']"
          required
        >
        </v-select>
      </form>
      <Form :formData="formData[1]" />
      <Form :formData="formData[2]" />
      <Form :formData="formData[3]" />
      <v-btn type="button" name="button" @click="doSend(maincompanykey.key)">
        send
      </v-btn>
    </v-container>
  </div>
</template>
<script>
import firebase from "firebase";
import Form from "../components/Form.vue";
import { mapState } from "vuex";
export default {
  components: {
    Form
  },
  data() {
    return {
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
      prefecture: "",
      formData: [
        {
          displayname: "会社名",
          formText: "",
          placeholder: "companyname"
        },
        {
          displayname: "住所",
          formText: "",
          placeholder: "市番地"
        },
        {
          displayname: "会社URL",
          formText: "",
          placeholder: "url"
        },
        {
          displayname: "電話番号",
          formText: "",
          placeholder: "000-0000"
        }
      ],
      user: {} // ユーザー情報
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {};
    });
  },
  computed: {
    ...mapState({
      maincompanykey: "maincompanykey"
    })
  },
  methods: {
    doSend(key) {
      if (
        this.formData[0].formText.length &&
        !this.prefecture == "" &&
        this.formData[1].formText.length &&
        this.formData[2].formText.length &&
        this.formData[3].formText.length
      ) {
        firebase
          .database()
          .ref("sub-company")
          .push(
            {
              name: this.formData[0].formText,
              prefecture: this.prefecture,
              address: this.formData[1].formText,
              url: this.formData[2].formText,
              phonenumber: this.formData[3].formText,
              main_com_id: key,
              user_id: this.user.uid,
              yes: 0,
              no: 0
            },
            () => {
              window.location.href = "./";
            }
          );
      } else if (!this.formData[0].formText.length) {
        alert("会社名を入力してください");
      } else if (this.prefecture == "") {
        alert("都道府県を入力してください");
      } else if (!this.formData[1].formText.length) {
        alert("住所を入力してください");
      } else if (!this.formData[2].formText.length) {
        alert("URLを入力してください");
      } else {
        alert("電話番号を入力してください");
      }
    }
  }
};
</script>
