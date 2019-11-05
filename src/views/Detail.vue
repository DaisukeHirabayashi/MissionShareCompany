<template>
  <div class="detail">
    <h2>詳細ページ</h2>
    <div>会社名:{{ company.name }}</div>
    <div>実習場所:{{ company.place }}</div>
    <div>実習期間:{{ company.day }}</div>
    <div>感想:{{ company.feel }}</div>
    <br />
    <h3>~みんなのコメント~</h3>
    <!--Firebase から取得したリストを描画（トランジション付き）-->
    <transition-group name="chat" tag="div" class="list content">
      <section
        v-for="{ key, name, image, message, companykey } in chat"
        :key="key"
      >
        <div v-if="company.key == companykey" key="chat" class="box11">
          <div class="item-detail">
            <div class="item-name">{{ name }}</div>
            <div class>
              {{ message }}
            </div>
          </div>
        </div>
      </section> </transition-group
    >

    <!-- 入力フォーム -->
    <form action="" @submit.prevent="doSend(company.key)" class="form">
      <textarea
        v-model="input"
        :disabled="!user.uid"
        placeholder="コメントを残す"
      ></textarea>
      <button type="submit" :disabled="!user.uid" class="send-button">
        Send
      </button>
    </form>
  </div>
</template>
<script>
import { mapState } from "vuex";
import firebase from "firebase";
import Nl2br from "vue-nl2br";
export default {
  components: { Nl2br },
  data() {
    return {
      user: {}, // ユーザー情報
      chat: [], // 取得したメッセージを入れる配列
      input: "" // 入力したメッセージ
    };
  },
  created() {
    setInterval(() => {
      firebase.auth().onAuthStateChanged(user => {
        this.user = user ? user : {};
        this.chat = [];
        const ref_message = firebase
          .database()
          .ref("comment/" + this.$store.state.company.key);
        ref_message.limitToLast(100).on("child_added", this.childAdded);
      });
    }, 100); //更新に時間がかかるため
  },
  computed: {
    ...mapState({
      company: "company"
    })
  },
  methods: {
    childAdded(snap) {
      const message = snap.val();
      this.chat.push({
        key: snap.key,
        name: message.name,
        image: message.image,
        message: message.message,
        companykey: message.companykey
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
              companykey: sendkey
            },
            () => {
              this.input = ""; // フォームを空にする
            }
          );
      }
    }
  }
};
</script>
