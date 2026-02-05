<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useBookStore } from '@/stores/book.store.ts';
import BookCard from '@/components/BookCard.vue';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '@/stores/auth.store';
import router from "@/router";

const bookStore = useBookStore();
const searchQuery = ref('');
const currentPage = ref(0);
const pageSize = 4;
const scrollContainer = ref<HTMLElement | null>(null);
const authStore = useAuthStore();

onMounted(async () => {
  // Load Top 10 and initial search results in parallel
  await Promise.all([
    bookStore.fetchTop10(),
    loadBooks()
  ]);
});

const loadBooks = async () => {
  await bookStore.searchBooks(searchQuery.value, currentPage.value, pageSize);
  // Scroll to top of results section after pagination
  document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
};

// Debounced Search Logic: Wait 500ms after user stops typing before calling API
let debounceTimeout: ReturnType<typeof setTimeout>;
watch(searchQuery, () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    currentPage.value = 0; // Reset to first page on new search
    loadBooks();
  }, 500);
});

const nextPage = () => {
  // Simple check: if we have a full page, assume there's a next one
  if (bookStore.books.length === pageSize) {
    currentPage.value++;
    loadBooks();
  }
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    loadBooks();
  }
};

const scroll = (direction: 'left' | 'right') => {
  if (scrollContainer.value) {
    const scrollAmount = 400;
    scrollContainer.value.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<template>
  <div class="home-wrapper">
    <nav class="top-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <Icon icon="lucide:book-open" class="nav-logo" />
          <span>BookTrack</span>
        </div>
        <div class="nav-actions">
          <div class="user-pill" v-if="authStore.username">
            <Icon icon="lucide:user" class="user-icon" />
            <span>{{ authStore.username }}</span>
          </div>
          <button @click="handleLogout" class="logout-btn" title="Logout">
            <Icon icon="lucide:log-out" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
    <header class="hero-section">
      <div class="hero-content">
        <h1>Discover Your Next Adventure</h1>
        <p>Explore our vast collection of books and find your favorites.</p>

        <div class="search-container">
          <Icon icon="lucide:search" class="search-icon" />
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by title, author..."
              class="search-input"
          />
          <span v-if="bookStore.isLoading" class="search-loader"></span>
        </div>
      </div>
    </header>

    <main class="main-content">
      <section v-if="bookStore.top10Books.length > 0" class="section-top10">
        <h2 class="section-title">
          <Icon icon="lucide:flame" class="title-icon flame" /> Top 10 Most Popular
        </h2>

        <div class="scroll-wrapper">
          <button class="nav-btn left" @click="scroll('left')" aria-label="Scroll Left">
            <Icon icon="lucide:chevron-left" />
          </button>

          <div class="horizontal-scroll-grid" ref="scrollContainer">
            <BookCard
                v-for="book in bookStore.top10Books"
                :key="'top'+book.id"
                :book="book"
                :is-top10="true"
                class="scroll-item"
            />
          </div>

          <button class="nav-btn right" @click="scroll('right')" aria-label="Scroll Right">
            <Icon icon="lucide:chevron-right" />
          </button>
        </div>
      </section>

      <section id="results-section" class="section-results">
        <h2 class="section-title">
          {{ searchQuery ? `Results for "${searchQuery}"` : 'All Books' }}
        </h2>

        <div v-if="bookStore.isLoading && currentPage === 0" class="loading-grid">
          <div class="spinner"></div>
          <p>Searching library...</p>
        </div>

        <div v-else-if="bookStore.books.length === 0" class="empty-state">
          <Icon icon="lucide:book-x" class="empty-icon" />
          <h3>No books found</h3>
          <p>Try adjusting your search terms.</p>
        </div>

        <div v-else class="books-grid">
          <BookCard
              v-for="book in bookStore.books"
              :key="book.id"
              :book="book"
          />
        </div>

        <div v-if="bookStore.books.length > 0" class="pagination-controls">
          <button
              @click="prevPage"
              :disabled="currentPage === 0 || bookStore.isLoading"
              class="page-btn"
          >
            <Icon icon="lucide:chevron-left" /> Previous
          </button>
          <span class="page-info">Page {{ currentPage + 1 }}</span>
          <button
              @click="nextPage"
              :disabled="bookStore.books.length < pageSize || bookStore.isLoading"
              class="page-btn"
          >
            Next <Icon icon="lucide:chevron-right" />
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Global Layout */
.home-wrapper { background-color: #f8f9fa; min-height: 100vh; }
.main-content { max-width: 1200px; margin: 0 auto; padding: 2rem; }
.section-title { font-size: 1.5rem; color: #2c3e50; margin-bottom: 1.5rem; }

/* Hero & Search Section */
.hero-section {
  background: linear-gradient(135deg, #3498db, #2c3e50);
  color: white; padding: 4rem 2rem; text-align: center;
}
.hero-content h1 { font-size: 2.5rem; margin-bottom: 1rem; }
.hero-content p { font-size: 1.1rem; opacity: 0.9; margin-bottom: 2rem; }

.search-container {
  position: relative; max-width: 600px; margin: 0 auto;
}
.search-input {
  width: 100%; padding: 1rem 1rem 1rem 3rem; border-radius: 50px;
  border: none; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}
.search-input:focus { outline: none; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
.search-icon {
  position: absolute; left: 1rem; top: 50%; transform: translateY(-50%);
  font-size: 1.2rem; opacity: 0.6; color: #2c3e50;
}
.search-loader {
  position: absolute; right: 1rem; top: 30%;
  border: 3px solid #f3f3f3; border-top: 3px solid #3498db;
  border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite;
}

/* Top 10 Horizontal Scroll */
.section-top10 { margin-bottom: 4rem; }
.horizontal-scroll-grid {
  display: flex; gap: 1.5rem; overflow-x: auto; padding: 1rem 0 2rem 0;
  scroll-snap-type: x mandatory;
  /* Hide scrollbar for cleaner look but allow scrolling */
  scrollbar-width: none; -ms-overflow-style: none;
}
.horizontal-scroll-grid::-webkit-scrollbar { display: none; }
.scroll-item { min-width: 260px; scroll-snap-align: start; }

.books-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.title-icon {
  vertical-align: middle;
  margin-right: 0.5rem;
  font-size: 1.8rem;
}

.title-icon.flame { color: #e67e22; }

.page-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-icon {
  font-size: 1.4rem;
  color: #95a5a6;
}
.scroll-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 -20px;
  padding: 0 20px;
}

.horizontal-scroll-grid {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 1rem 5px 2rem 5px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
}

.horizontal-scroll-grid::-webkit-scrollbar {
  display: none;
}

.scroll-item {
  min-width: 280px;
  flex-shrink: 0;
}
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 30;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  border: 1px solid #edf2f7;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #2d3748;
}

.nav-btn svg {
  width: 30px;
  height: 30px;
}

.nav-btn:hover {
  background: #3498db;
  color: white;
  border-color: transparent;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 10px 25px rgba(52, 152, 219, 0.3);
}

.nav-btn.left {
  left: 0;
}

.nav-btn.right {
  right: 0;
}
.top-nav {
  background: white;
  padding: 0.75rem 2rem;
  border-bottom: 1px solid #edf2f7;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  color: #2c3e50;
  font-size: 1.2rem;
}

.nav-logo {
  color: #3498db;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: #f1f5f9;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #e74c3c;
  color: white;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.2);
}

/* States & Pagination */
.loading-grid, .empty-state { text-align: center; padding: 4rem; color: #7f8c8d; }
.empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
.spinner {
  border: 4px solid #f3f3f3; border-top: 4px solid #3498db;
  border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;
  margin: 0 auto 1rem auto;
}

.pagination-controls {
  display: flex; justify-content: center; align-items: center;
  gap: 1.5rem; margin-top: 3rem;
}
.page-btn {
  padding: 0.8rem 1.5rem; background: white; border: 1px solid #dcdde1;
  border-radius: 30px; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.page-btn:hover:not(:disabled) { background: #3498db; color: white; border-color: #3498db; }
.page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.page-info { font-weight: bold; color: #2c3e50; }

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* Responsive adjustments */
@media (max-width: 768px) {
  .nav-btn {
    display: none !important;
  }
  .scroll-wrapper {
    margin: 0;
    padding: 0;
  }
}
</style>