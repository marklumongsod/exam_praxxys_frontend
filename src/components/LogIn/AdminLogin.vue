<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card>
            <v-card-title class="headline">Login</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="loginUser">
                <v-text-field v-model="loginData.username" label="Username" required></v-text-field>
                <v-text-field v-model="loginData.password" label="Password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" required></v-text-field>
                <v-checkbox v-model="rememberMe" label="Remember Me"></v-checkbox>
                <v-btn type="submit" color="primary">Login</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" top>
        {{ snackbar.text }}
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackbar.show = false">Close</v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        loginData: {
          username: localStorage.getItem('rememberedUsername') || '',
          password: '',
        },
        rememberMe: false,
        showPassword: false,
        snackbar: {
        show: false,
        text: '',
        color: '',
      },
      };
    },
    methods: {
        async loginUser() {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/login', this.loginData);
                const token = response.data.token;

                if (this.rememberMe) {
                localStorage.setItem('token', token);
                localStorage.setItem('rememberedUsername', this.loginData.username);
                } else {
                sessionStorage.setItem('token', token);
                localStorage.removeItem('rememberedUsername');
                }

                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                this.showSnackbar('Login successful', 'success');
                this.$router.push('/dashboard');
               
            } catch (error) {
                console.error('Login failed:', error);

                if (error.response && error.response.status === 401) {
                this.showSnackbar('Invalid credentials', 'error');
                } else {
                this.showSnackbar('Login failed', 'error');
                }
            }
            },
      showSnackbar(text, color) {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    },
  };
  </script>
  