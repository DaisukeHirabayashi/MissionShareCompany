<template>
  <div id="app">
    <v-app-bar app clipped-left color="amber">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <!-- 検索機能を今後つけたようにおいてあります -->
      <span class="title ml-3 mr-5"
        >Job&nbsp;<span class="font-weight-light">Search</span></span
      >
      <v-text-field solo-inverted flat hide-details label="Search" />

      <v-spacer />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app clipped color="grey lighten-4">
      <v-list dense class="grey lighten-4">
        <v-list-item-action>
          <router-link to="/">
            <v-icon>Home</v-icon>
          </router-link>
          <div v-if="user.uid" key="login">
            <router-link to="/register">
              <v-icon>Register</v-icon>
            </router-link>
          </div>
        </v-list-item-action>
        <v-list-item-content> </v-list-item-content>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container fluid class="grey lighten-4 fill-height"> </v-container>
    </v-content>

    <div id="nav"></div>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
#keep .v-navigation-drawer__border {
  display: none;
}
</style>
<script>
import firebase from "firebase";
export default {
  data() {
    return {
      user: {},
      drawer: null
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {};
    });
  }
};
</script>
