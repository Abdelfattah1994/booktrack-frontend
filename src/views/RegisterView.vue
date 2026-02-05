<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const isLoading = ref(false)

const authStore = useAuthStore()
const router = useRouter()

const handleRegister = async () => {
  error.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  isLoading.value = true

  try {
    const success = await authStore.register({
      username: username.value,
      email: email.value,
      password: password.value
    })

    if (success) {
      router.push('/')
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-page"> <div class="login-card">
    <div class="login-header">
      <div class="logo">📚</div>
      <h1>BookTrack</h1>
      <p>Create your account to start your collection.</p>
    </div>

    <form @submit.prevent="handleRegister" class="login-form">
      <div class="input-group">
        <label for="username">Username</label>
        <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Choose a username"
            required
        />
      </div>

      <div class="input-group">
        <label for="email">Email Address</label>
        <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
        />
      </div>

      <div class="input-group">
        <label for="password">Password</label>
        <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
        />
      </div>

      <div class="input-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
        />
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button type="submit" :disabled="isLoading" class="login-button">
        <span v-if="isLoading" class="loader"></span>
        <span v-else>Create Account</span>
      </button>
    </form>

    <div class="login-footer">
      <p>Already have an account? <router-link to="/">Login here</router-link></p>
    </div>
  </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f8f9fa;
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px;
  transition: transform 0.3s ease;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  font-size: 3rem;
  margin-bottom: 1rem;
}

h1 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

p {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

label {
  font-weight: 600;
  font-size: 0.85rem;
  color: #34495e;
}

input {
  padding: 0.8rem;
  border: 1px solid #dcdde1;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #3498db;
}

.login-button {
  background-color: #3498db;
  color: white;
  padding: 0.9rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 0.5rem;
}

.login-button:hover:not(:disabled) {
  background-color: #2980b9;
}

.login-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  background: #fdf2f2;
  padding: 0.7rem;
  border-radius: 6px;
  font-size: 0.85rem;
  text-align: center;
}

.login-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.85rem;
}

.login-footer a {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
}

.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>