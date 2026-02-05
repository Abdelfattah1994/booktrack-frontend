import { defineStore } from 'pinia'
import api from '@/api/http'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/dto'

interface AuthState {
    token: string | null
    username: string | null
}

const STORAGE_KEY = 'booktrack.auth'

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => {
        // Initialize state from localStorage to persist session on page refresh
        const savedAuth = localStorage.getItem(STORAGE_KEY)
        return savedAuth ? JSON.parse(savedAuth) : { token: null, username: null }
    },

    getters: {
        isAuthenticated: (state) => !!state.token,
        getUser: (state) => state.username
    },

    actions: {
        async login(credentials: LoginRequest): Promise<boolean> {
            try {
                const response = await api.post<AuthResponse>('/auth/login', credentials)
                this.token = response.data.token
                this.username = response.data.username

                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    token: this.token,
                    username: this.username
                }))

                return true
            } catch (error) {
                console.error('Login error:', error)
                throw error
            }
        },

        /**
         * Register a new user account
         */
        async register(userData: RegisterRequest): Promise<boolean> {
            try {
                await api.post('/auth/register', userData)
                return true
            } catch (error) {
                console.error('Registration error:', error)
                throw error
            }
        },

        /**
         * Clear local session and logout
         */
        logout(): void {
            this.token = null
            this.username = null
            localStorage.removeItem(STORAGE_KEY)
        }
    }
})