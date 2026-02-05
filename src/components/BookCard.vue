<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import type { BookResponse } from '@/types/dto';

const props = defineProps<{
  book: BookResponse;
  isTop10?: boolean;
}>();

const imageError = ref(false);
const coverUrl = `https://covers.openlibrary.org/b/isbn/${props.book.isbn}-M.jpg?default=false`;

const handleImageError = () => {
  imageError.value = true;
};
</script>

<template>
  <div class="book-card" :class="{ 'top-10-card': isTop10 }">
    <div class="card-image">
      <img
          v-if="book.isbn && !imageError"
          :src="coverUrl"
          :alt="book.title"
          @error="handleImageError"
          class="book-cover-img"
      />
      <div v-else class="image-placeholder">
        <Icon icon="lucide:book-open" class="book-icon-placeholder" />
      </div>

      <div class="rating-badge">
        <Icon icon="lucide:star" class="star-icon" />
        <span>{{ book.rating.toFixed(1) }}</span>
      </div>
    </div>

    <div class="card-content">
      <h3 class="title" :title="book.title">{{ book.title }}</h3>
      <p class="author">by {{ book.author }}</p>
      <p class="summary">{{ book.summary }}</p>
    </div>

    <div class="card-actions">
      <button class="details-btn">
        View Details
      </button>
    </div>
  </div>
</template>

<style scoped>
.book-card {
  display: flex;
  flex-direction: column;
  height: 480px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid #edf2f7;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

/* Header image area */
.card-image {
  height: 240px;
  background: #f7fafc;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.book-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures image covers area without distortion */
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #a0aec0;
}

.book-icon-placeholder {
  font-size: 4rem;
  opacity: 0.5;
}

.rating-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: #3498db;
  color: white;
  padding: 0.4rem 0.7rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

.star-icon {
  color: #f1c40f;
  font-size: 1rem;
}

/* Top 10 specific styles */
.top-10-card {
  border-top: 5px solid #f1c40f;
}

.top-10-card .rating-badge {
  background: #f1c40f;
  color: #2c3e50;
}

.top-10-card .star-icon {
  color: #2c3e50;
}

.card-content {
  padding: 1.25rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.title {
  margin: 0 0 0.5rem 0;
  font-size: 1.15rem;
  color: #1a202c;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.author {
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  font-style: italic;
}

.summary {
  color: #4a5568;
  font-size: 0.875rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: auto;
}

.card-actions {
  padding: 1.25rem;
  background: #f8fafc;
  margin-top: auto;
}

.details-btn {
  width: 100%;
  padding: 0.75rem;
  background: white;
  color: #3498db;
  border: 2px solid #3498db;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.details-btn:hover {
  background: #3498db;
  color: white;
}
</style>