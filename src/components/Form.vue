<template>
  <div class="Form">
    <form class="p-5">
      <h2>{{ formData.displayname }}</h2>
      <div class="form-group">
        <input
          type="text"
          class="form-control"
          :placeholder="formData.placeholder"
          v-model="formData.formText"
        />
      </div>
    </form>
  </div>
</template>
<script>
export default {
  name: "Counter",
  props: {
    formData: Object
  },
  methods: {
    plus() {
      this.$emit("plus");
    }
  }
};
</script>
