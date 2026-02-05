<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBookStore } from '@/stores/book.store';
import { Icon } from '@iconify/vue';

const route = useRoute();
const router = useRouter();
const bookStore = useBookStore();
const imageError = ref(false);

onMounted(async () => {
  const bookId = Number(route.params.id);
  await bookStore.fetchDetails(bookId);
});

const handleImageError = () => {
  imageError.value = true;
};

const goBack = () => router.back();
</script>

<template>
  <div class="detail-wrapper">
    <div class="container" v-if="bookStore.currentBook">

      <nav class="detail-nav">
        <button @click="goBack" class="back-link">
          <Icon icon="lucide:arrow-left" width="20" />
          <span>Back to collection</span>
        </button>
      </nav>

      <main class="book-detail-grid">
        <div class="cover-column">
          <div class="sticky-container">
            <div class="cover-frame">
              <img
                v-if="!imageError && bookStore.currentBook.isbn"
                :src="`https://covers.openlibrary.org/b/isbn/${bookStore.currentBook.isbn}-L.jpg?default=false`"
                :alt="bookStore.currentBook.title"
                @error="handleImageError"
                class="book-image"
              />
              <div v-else class="image-fallback">
                <Icon icon="lucide:book-open" width="80" />
                <p>No cover available</p>
              </div>
            </div>
          </div>
        </div>

        <div class="info-column">
          <div class="meta-badges">
            <span class="badge rating">
              <Icon icon="lucide:star" width="16" />
              {{ bookStore.currentBook.rating.toFixed(1) }}
            </span>
            <span class="badge isbn">
              <Icon icon="lucide:barcode" width="16" />
              {{ bookStore.currentBook.isbn }}
            </span>
          </div>

          <h1 class="book-title">{{ bookStore.currentBook.title }}</h1>

          <div class="author-info">
            <Icon icon="lucide:user" width="20" />
            <span>by {{ bookStore.currentBook.author }}</span>
          </div>

          <hr class="divider" />

          <section class="summary-section">
            <h2 class="section-subtitle">
              <Icon icon="lucide:align-left" width="20" />
              Summary
            </h2>
            <p class="summary-text">{{ bookStore.currentBook.summary }}</p>
          </section>

          <div class="action-footer">
            <button class="btn-favorite">
              <Icon icon="lucide:heart" width="22" />
              Add to my favorites
            </button>
          </div>
        </div>
      </main>
    </div>

    <div v-else class="loading-state">
      <div class="spinner"></div>
      <p>Loading book details...</p>
    </div>
  </div>
</template>

<style scoped>
.detail-wrapper {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 2rem 1rem;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
}

.detail-nav {
  margin-bottom: 2rem;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

.back-link:hover {
  color: #3498db;
}

.book-detail-grid {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 4rem;
  background: white;
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
}

.sticky-container {
  position: sticky;
  top: 2rem;
}

.cover-frame {
  width: 100%;
  aspect-ratio: 2/3;
  background: #f1f5f9;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-fallback {
  text-align: center;
  color: #94a3b8;
}

.meta-badges {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
}

.badge.rating {
  background: #fef3c7;
  color: #92400e;
}

.badge.isbn {
  background: #f1f5f9;
  color: #475569;
}

.book-title {
  font-size: 2.8rem;
  color: #1e293b;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.divider {
  border: 0;
  border-top: 1px solid #e2e8f0;
  margin: 2rem 0;
}

.section-subtitle {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.1rem;
  color: #1e293b;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.summary-text {
  font-size: 1.15rem;
  line-height: 1.8;
  color: #475569;
  white-space: pre-line;
}

.action-footer {
  margin-top: 3rem;
}

.btn-favorite {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);
}

.btn-favorite:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

@media (max-width: 900px) {
  .book-detail-grid {
    grid-template-columns: 1fr;
    padding: 2rem;
    gap: 2rem;
  }
  .book-title { font-size: 2rem; }
  .cover-column { max-width: 300px; margin: 0 auto; }
}
</style>