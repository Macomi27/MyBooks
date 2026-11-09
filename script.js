/**
 * Simple Book List App
 * Pure HTML, CSS & Vanilla JavaScript
 * Persists data with browser localStorage
 */

(function () {
  'use strict';

  // --- Storage Key ---
  const STORAGE_KEY = 'my_simple_book_list_v1';

  // --- App State ---
  let books = [];
  let searchQuery = '';
  let activeFilter = 'all'; // 'all' | 'read' | 'unread'
  let bookToDeleteId = null;

  // --- DOM Elements ---
  // Stats
  const totalBooksCountEl = document.getElementById('total-books-count');
  const readBooksCountEl = document.getElementById('read-books-count');
  const unreadBooksCountEl = document.getElementById('unread-books-count');

  // Add Book Form
  const addForm = document.getElementById('add-book-form');
  const titleInput = document.getElementById('book-title');
  const authorInput = document.getElementById('book-author');
  const statusSelect = document.getElementById('book-status');

  // Search & Filters
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const resetSearchBtn = document.getElementById('reset-search-btn');

  // Lists & States
  const booksContainer = document.getElementById('books-container');
  const emptyStateEl = document.getElementById('empty-state');
  const noResultsStateEl = document.getElementById('no-search-results');
  const noResultsMsgEl = document.getElementById('no-results-msg');
  const resultsBadgeEl = document.getElementById('results-badge');

  // Edit Modal
  const editModal = document.getElementById('edit-modal');
  const editForm = document.getElementById('edit-book-form');
  const editIdInput = document.getElementById('edit-book-id');
  const editTitleInput = document.getElementById('edit-book-title');
  const editAuthorInput = document.getElementById('edit-book-author');
  const editStatusSelect = document.getElementById('edit-book-status');
  const closeEditModalBtn = document.getElementById('close-edit-modal-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');

  // Delete Modal
  const deleteModal = document.getElementById('delete-modal');
  const deleteTitleEl = document.getElementById('delete-book-title-target');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

  // --- Storage Helpers ---
  function loadBooksFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading books from localStorage:', e);
    }
    return [];
  }

  function saveBooksToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch (e) {
      console.error('Error saving books to localStorage:', e);
    }
  }

  // --- Core Operations ---
  function addBook(title, author, isRead) {
    const newBook = {
      id: 'book_' + Date.now().toString() + '_' + Math.random().toString(36).slice(2, 7),
      title: title.trim(),
      author: author.trim(),
      isRead: Boolean(isRead),
      createdAt: Date.now()
    };

    // Add to the beginning of the list
    books.unshift(newBook);
    saveBooksToStorage();
    render();
  }

  function updateBook(id, title, author, isRead) {
    const index = books.findIndex(b => b.id === id);
    if (index !== -1) {
      books[index].title = title.trim();
      books[index].author = author.trim();
      books[index].isRead = Boolean(isRead);
      saveBooksToStorage();
      render();
    }
  }

  function deleteBook(id) {
    books = books.filter(b => b.id !== id);
    saveBooksToStorage();
    render();
  }

  function toggleBookStatus(id) {
    const book = books.find(b => b.id === id);
    if (book) {
      book.isRead = !book.isRead;
      saveBooksToStorage();
      render();
    }
  }

  // --- Rendering ---
  function render() {
    // 1. Update stats at the top
    const totalCount = books.length;
    const readCount = books.filter(b => b.isRead).length;
    const unreadCount = totalCount - readCount;

    totalBooksCountEl.textContent = totalCount;
    readBooksCountEl.textContent = readCount;
    unreadBooksCountEl.textContent = unreadCount;

    // 2. Filter & Search
    const query = searchQuery.trim().toLowerCase();
    const filteredBooks = books.filter(book => {
      // Filter by status tab
      if (activeFilter === 'read' && !book.isRead) return false;
      if (activeFilter === 'unread' && book.isRead) return false;

      // Filter by search query
      if (query) {
        const matchesTitle = book.title.toLowerCase().includes(query);
        const matchesAuthor = book.author.toLowerCase().includes(query);
        return matchesTitle || matchesAuthor;
      }
      return true;
    });

    // 3. Update visibility & empty states
    if (books.length === 0) {
      // User has no books at all
      emptyStateEl.style.display = 'flex';
      noResultsStateEl.style.display = 'none';
      booksContainer.style.display = 'none';
      resultsBadgeEl.textContent = '';
      return;
    }

    emptyStateEl.style.display = 'none';

    if (filteredBooks.length === 0) {
      // Books exist, but current search/filter has no matches
      noResultsStateEl.style.display = 'flex';
      booksContainer.style.display = 'none';
      if (query) {
        noResultsMsgEl.textContent = `No books match "${searchQuery.trim()}". Try adjusting your search term.`;
      } else {
        noResultsMsgEl.textContent = `No books found in the "${activeFilter === 'read' ? 'Read' : 'Not Read'}" category.`;
      }
      resultsBadgeEl.textContent = '0 matches';
      return;
    }

    noResultsStateEl.style.display = 'none';
    booksContainer.style.display = 'grid';

    // Results count badge
    if (filteredBooks.length === totalCount && !query && activeFilter === 'all') {
      resultsBadgeEl.textContent = `${totalCount} ${totalCount === 1 ? 'book' : 'books'}`;
    } else {
      resultsBadgeEl.textContent = `Showing ${filteredBooks.length} of ${totalCount}`;
    }

    // 4. Render book cards (using safe DOM creation to prevent XSS)
    booksContainer.innerHTML = '';
    filteredBooks.forEach(book => {
      const card = createBookCardElement(book);
      booksContainer.appendChild(card);
    });
  }

  function createBookCardElement(book) {
    const card = document.createElement('article');
    card.className = 'book-card';
    card.setAttribute('role', 'listitem');
    card.dataset.id = book.id;

    // Top: Title and Author
    const mainInfo = document.createElement('div');
    mainInfo.className = 'book-main-info';

    const titleEl = document.createElement('h3');
    titleEl.className = 'book-title';
    titleEl.textContent = book.title;

    const authorEl = document.createElement('p');
    authorEl.className = 'book-author';

    const authorLabel = document.createElement('span');
    authorLabel.className = 'book-author-label';
    authorLabel.textContent = 'by';

    const authorName = document.createElement('span');
    authorName.textContent = book.author;

    authorEl.appendChild(authorLabel);
    authorEl.appendChild(authorName);

    mainInfo.appendChild(titleEl);
    mainInfo.appendChild(authorEl);

    // Bottom Footer: Status Badge + Action Buttons
    const footer = document.createElement('div');
    footer.className = 'book-card-footer';

    // Status Badge (Interactive toggle button)
    const statusBtn = document.createElement('button');
    statusBtn.type = 'button';
    statusBtn.className = `status-badge ${book.isRead ? 'status-read' : 'status-unread'}`;
    statusBtn.setAttribute('title', 'Click to toggle read status');
    statusBtn.setAttribute('aria-label', `Status: ${book.isRead ? 'Read' : 'Not read'}. Click to toggle.`);

    const dot = document.createElement('span');
    dot.className = 'badge-dot';
    dot.setAttribute('aria-hidden', 'true');

    const statusText = document.createElement('span');
    statusText.textContent = book.isRead ? 'Read' : 'Not Read';

    statusBtn.appendChild(dot);
    statusBtn.appendChild(statusText);
    statusBtn.addEventListener('click', () => toggleBookStatus(book.id));

    // Actions (Edit & Delete)
    const actions = document.createElement('div');
    actions.className = 'card-actions';

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'icon-action-btn edit-btn';
    editBtn.setAttribute('title', 'Edit book');
    editBtn.setAttribute('aria-label', `Edit ${book.title}`);
    editBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    `;
    editBtn.addEventListener('click', () => openEditModal(book.id));

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'icon-action-btn delete-btn';
    deleteBtn.setAttribute('title', 'Delete book');
    deleteBtn.setAttribute('aria-label', `Delete ${book.title}`);
    deleteBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    `;
    deleteBtn.addEventListener('click', () => openDeleteModal(book.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    footer.appendChild(statusBtn);
    footer.appendChild(actions);

    card.appendChild(mainInfo);
    card.appendChild(footer);

    return card;
  }

  // --- Form Validation Helpers ---
  function clearFormError(inputEl) {
    inputEl.classList.remove('has-error');
  }

  function showFormError(inputEl) {
    inputEl.classList.add('has-error');
  }

  // --- Modal Management ---
  function openEditModal(id) {
    const book = books.find(b => b.id === id);
    if (!book) return;

    editIdInput.value = book.id;
    editTitleInput.value = book.title;
    editAuthorInput.value = book.author;
    editStatusSelect.value = book.isRead ? 'read' : 'unread';

    clearFormError(editTitleInput);
    clearFormError(editAuthorInput);

    editModal.classList.add('open');
    editModal.setAttribute('aria-hidden', 'false');
    editTitleInput.focus();
  }

  function closeEditModal() {
    editModal.classList.remove('open');
    editModal.setAttribute('aria-hidden', 'true');
    editForm.reset();
  }

  function openDeleteModal(id) {
    const book = books.find(b => b.id === id);
    if (!book) return;

    bookToDeleteId = id;
    deleteTitleEl.textContent = `"${book.title}"`;

    deleteModal.classList.add('open');
    deleteModal.setAttribute('aria-hidden', 'false');
    cancelDeleteBtn.focus();
  }

  function closeDeleteModal() {
    deleteModal.classList.remove('open');
    deleteModal.setAttribute('aria-hidden', 'true');
    bookToDeleteId = null;
  }

  // --- Event Handlers & Bindings ---
  function setupEventListeners() {
    // 1. Add Book Form Submission
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = titleInput.value.trim();
      const author = authorInput.value.trim();
      let isValid = true;

      if (!title) {
        showFormError(titleInput);
        isValid = false;
      } else {
        clearFormError(titleInput);
      }

      if (!author) {
        showFormError(authorInput);
        isValid = false;
      } else {
        clearFormError(authorInput);
      }

      if (!isValid) return;

      const isRead = statusSelect.value === 'read';
      addBook(title, author, isRead);

      // Reset form and errors
      addForm.reset();
      titleInput.focus();
    });

    titleInput.addEventListener('input', () => clearFormError(titleInput));
    authorInput.addEventListener('input', () => clearFormError(authorInput));

    // 2. Edit Book Form Submission
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = editIdInput.value;
      const title = editTitleInput.value.trim();
      const author = editAuthorInput.value.trim();
      let isValid = true;

      if (!title) {
        showFormError(editTitleInput);
        isValid = false;
      } else {
        clearFormError(editTitleInput);
      }

      if (!author) {
        showFormError(editAuthorInput);
        isValid = false;
      } else {
        clearFormError(editAuthorInput);
      }

      if (!isValid) return;

      const isRead = editStatusSelect.value === 'read';
      updateBook(id, title, author, isRead);
      closeEditModal();
    });

    editTitleInput.addEventListener('input', () => clearFormError(editTitleInput));
    editAuthorInput.addEventListener('input', () => clearFormError(editAuthorInput));

    closeEditModalBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);

    // 3. Delete Confirmation
    confirmDeleteBtn.addEventListener('click', () => {
      if (bookToDeleteId) {
        deleteBook(bookToDeleteId);
        closeDeleteModal();
      }
    });

    cancelDeleteBtn.addEventListener('click', closeDeleteModal);

    // 4. Search Filter
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value;
      clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
      render();
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.style.display = 'none';
      searchInput.focus();
      render();
    });

    resetSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.style.display = 'none';
      activeFilter = 'all';
      filterButtons.forEach(btn => {
        const isActive = btn.dataset.filter === 'all';
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      render();
    });

    // 5. Category Filter Tabs
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        activeFilter = btn.dataset.filter;
        render();
      });
    });

    // 6. Close modals on backdrop click or Escape key
    [editModal, deleteModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeEditModal();
          closeDeleteModal();
        }
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (editModal.classList.contains('open')) closeEditModal();
        if (deleteModal.classList.contains('open')) closeDeleteModal();
      }
    });
  }

  // --- Initialization ---
  function init() {
    books = loadBooksFromStorage();
    setupEventListeners();
    render();
  }

  // Start app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

