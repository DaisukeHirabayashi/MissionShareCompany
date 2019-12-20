<template>
  <div class="Form">
    <form class="p-3">
      <v-card-title>{{ formData.displayname }}</v-card-title>
      <v-text-field
        :label="formData.placeholder"
        v-model="formData.formText"
        :rules="formData.rules"
      >
      </v-text-field>
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
