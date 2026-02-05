import { defineStore } from 'pinia'
import api from '@/api/http'
import type { BookResponse, PageBookResponse } from '@/types/dto'

export const useBookStore = defineStore('book', {
    state: () => ({
        books: [] as BookResponse[],
        top10Books: [] as BookResponse[],
        currentBook: null as BookResponse | null,
        totalElements: 0,
        isLoading: false
    }),

    actions: {
        /**
         * Search books with pagination
         */
        async searchBooks(query: string = '', page: number = 0, size: number = 20) {
            this.isLoading = true
            try {
                const response = await api.get<PageBookResponse>('/books', {
                    params: { query, page, size }
                })
                this.books = response.data.content
                this.totalElements = response.data.totalElements
            } finally {
                this.isLoading = false
            }
        },

        /**
         * Get the most popular books
         */
        async fetchTop10() {
            const response = await api.get<BookResponse[]>('/books/top10')
            this.top10Books = response.data
        },

        /**
         * Get details for a single book
         */
        async fetchDetails(id: number) {
            const response = await api.get<BookResponse>(`/books/${id}`)
            this.currentBook = response.data
        }
    }
})