import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'login',
            component: LoginView
        },
        {
            path: '/books',
            name: 'books',
            component: HomeView
        },
        {
            path: '/books/:id',
            name: 'book-details',
            component: () => import('@/views/BookDetailView.vue'),
            props: true
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/RegisterView.vue')
        }
    ]
})

export default router