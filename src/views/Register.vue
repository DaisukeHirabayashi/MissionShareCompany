<template>
  <div class="register">
    <h1>会社登録ページ</h1>
    <div v-for="obj in formData">
      <Form :formData="obj" />
    </div>
    <button type="button" name="button" @click="doSend">send</button>
  </div>
</template>
<script>
import firebase from "firebase";
import Form from "../components/Form.vue";
export default {
  components: {
    Form
  },
  data() {
    return {
      formData: [
        {
          displayname: "会社名",
          formText: "",
          placeholder: "companyname"
        },
        {
          displayname: "実習場所",
          formText: "",
          placeholder: "place"
        },
        {
          displayname: "日にち",
          formText: "",
          placeholder: "day"
        },
        {
          displayname: "感想",
          formText: "",
          placeholder: "feel"
        }
      ]
    };
  },
  methods: {
    doSend() {
      // firebase にメッセージを追加
      if (
        this.formData[0].formText.length &&
        this.formData[1].formText.length &&
        this.formData[2].formText.length &&
        this.formData[3].formText.length
      ) {
        firebase
          .database()
          .ref("company")
          .push(
            {
              name: this.formData[0].formText,
              place: this.formData[1].formText,
              day: this.formData[2].formText,
              feel: this.formData[3].formText
            },
            () => {
              window.location.href = "./";
            }
          );
      }
    }
  }
};
</script>
