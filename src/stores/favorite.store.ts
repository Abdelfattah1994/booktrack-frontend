import { defineStore } from 'pinia'
import api from '@/api/http'
import type { BookResponse } from '@/types/dto'

export const useFavoriteStore = defineStore('favorite', {
    state: () => ({
        favorites: [] as BookResponse[],
    }),

    actions: {
        /**
         * Fetch user's favorite books
         */
        async fetchFavorites() {
            const response = await api.get<BookResponse[]>('/users/favorites')
            this.favorites = response.data
        },

        /**
         * Add a book to favorites
         */
        async toggleFavorite(bookId: number) {
            await api.post(`/users/favorites/${bookId}`)
            await this.fetchFavorites()
        }
    }
})