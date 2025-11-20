<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon left class="mr-2">mdi-account-group</v-icon>
        User Management
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="fetchUsersFromAPI"
          :loading="fetchLoading"
          :disabled="fetchLoading"
        >
          <v-icon left>mdi-download</v-icon>
          Fetch Users from API
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- Filters -->
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search.name"
              label="Filter by Name"
              prepend-inner-icon="mdi-account"
              clearable
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search.email"
              label="Filter by Email"
              prepend-inner-icon="mdi-email"
              clearable
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search.city"
              label="Filter by City"
              prepend-inner-icon="mdi-city"
              clearable
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Data Table -->
        <v-data-table
          :headers="headers"
          :items="filteredUsers"
          :items-per-page="25"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn
              size="small"
              color="primary"
              variant="text"
              @click="openEditDialog(item)"
            >
              <v-icon>mdi-pencil</v-icon>
              Edit
            </v-btn>
          </template>

          <template v-slot:loading>
            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
          </template>

          <template v-slot:no-data>
            <v-alert type="info" variant="tonal">
              No users found. Click "Fetch Users from API" to load data.
            </v-alert>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit User</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedUser.name"
                  label="Name"
                  prepend-icon="mdi-account"
                  variant="outlined"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedUser.email"
                  label="Email"
                  prepend-icon="mdi-email"
                  variant="outlined"
                  :rules="[rules.required, rules.email]"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedUser.city"
                  label="City"
                  prepend-icon="mdi-city"
                  variant="outlined"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="closeEditDialog">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            @click="saveUser"
            :loading="saveLoading"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import api from '../services/api';

export default {
  name: 'UserTable',
  data() {
    return {
      users: [],
      loading: false,
      fetchLoading: false,
      saveLoading: false,
      editDialog: false,
      editedUser: {},
      originalUser: {},
      search: {
        name: '',
        email: '',
        city: ''
      },
      headers: [
        { title: 'Name', key: 'name', sortable: true },
        { title: 'Email', key: 'email', sortable: true },
        { title: 'City', key: 'city', sortable: true },
        { title: 'Actions', key: 'actions', sortable: false }
      ],
      rules: {
        required: value => !!value || 'This field is required',
        email: value => {
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return pattern.test(value) || 'Invalid email format';
        }
      },
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      }
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => {
        const nameMatch = !this.search.name || 
          user.name.toLowerCase().includes(this.search.name.toLowerCase());
        const emailMatch = !this.search.email || 
          user.email.toLowerCase().includes(this.search.email.toLowerCase());
        const cityMatch = !this.search.city || 
          user.city.toLowerCase().includes(this.search.city.toLowerCase());
        
        return nameMatch && emailMatch && cityMatch;
      });
    }
  },
  mounted() {
    this.loadUsers();
  },
  methods: {
    async loadUsers() {
      this.loading = true;
      try {
        const response = await api.getUsers();
        this.users = response.data.data;
        this.showSnackbar('Users loaded successfully', 'success');
      } catch (error) {
        console.error('Error loading users:', error);
        this.showSnackbar('Error loading users', 'error');
      } finally {
        this.loading = false;
      }
    },
    async fetchUsersFromAPI() {
      this.fetchLoading = true;
      try {
        const response = await api.fetchUsers();
        this.showSnackbar(response.data.message, 'success');
        await this.loadUsers();
      } catch (error) {
        console.error('Error fetching users:', error);
        this.showSnackbar('Error fetching users from API', 'error');
      } finally {
        this.fetchLoading = false;
      }
    },
    openEditDialog(user) {
      this.editedUser = { ...user };
      this.originalUser = { ...user };
      this.editDialog = true;
    },
    closeEditDialog() {
      this.editDialog = false;
      this.editedUser = {};
      this.originalUser = {};
    },
    async saveUser() {
      // Validation
      if (!this.editedUser.name || !this.editedUser.email || !this.editedUser.city) {
        this.showSnackbar('Please fill all fields', 'warning');
        return;
      }

      this.saveLoading = true;
      try {
        await api.updateUser(this.editedUser.uuid, {
          name: this.editedUser.name,
          email: this.editedUser.email,
          city: this.editedUser.city
        });

        // Update local data
        const index = this.users.findIndex(u => u.uuid === this.editedUser.uuid);
        if (index !== -1) {
          this.users[index] = { ...this.editedUser };
        }

        this.showSnackbar('User updated successfully', 'success');
        this.closeEditDialog();
      } catch (error) {
        console.error('Error updating user:', error);
        this.showSnackbar('Error updating user', 'error');
      } finally {
        this.saveLoading = false;
      }
    },
    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    }
  }
};
</script>

<style scoped>
.v-data-table {
  font-size: 14px;
}
</style>