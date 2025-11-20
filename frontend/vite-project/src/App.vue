<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-app-bar-title>
        <v-icon>mdi-account-multiple</v-icon>
        User Management System
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <UserTable />
    </v-main>
  </v-app>
</template>

<script>
import UserTable from './components/UserTable.vue';

export default {
  name: 'App',
  components: {
    UserTable
  }
};
</script>