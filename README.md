# My Books 📚

A clean, responsive, and lightweight personal book list tracker built with pure HTML, CSS, and vanilla JavaScript.

All data is stored directly in your browser using `localStorage`, keeping your reading collection private and available offline without requiring any backend, server, or database.

## ✨ Features

- **Add New Books**: Enter title, author, and reading status (Read / Not Read) with instant form validation.
- **Reading Stats**: View live counts at the top for Total Books, Read, and Not Read.
- **Interactive List**: View all your books neatly organized in clean cards.
- **One-Click Status Toggle**: Click on the status badge on any card to quickly switch between "Read" and "Not Read".
- **Edit Books**: Update any book's title, author, or status anytime via a clean modal dialog.
- **Safe Deletion**: Deletion requires confirmation with a dedicated modal showing the book title to avoid accidental loss.
- **Real-Time Search & Filters**: Search books instantly by title or author, or filter by reading status (All, Read, Not Read).
- **Friendly Empty States**: Helpful guidance shown when no books are saved or when no search matches are found.
- **Mobile-First & Responsive**: Optimized for phones, tablets, and desktop screens with touch-friendly controls (44px min touch targets).
- **Zero Dependencies**: Pure HTML5, CSS3, and JavaScript — no libraries, frameworks, or build steps required.

## 🚀 Getting Started

Simply open `index.html` in any modern web browser:

```bash
# Clone the repository
git clone https://github.com/Macomi27/MyBooks.git

# Navigate into the folder
cd MyBooks

# Open index.html in your default browser (or double click it in File Explorer)
```

## 📁 Project Structure

```
MyBooks/
├── index.html   # Semantic markup, form, controls, and accessible modals
├── style.css    # Clean modern styles, responsive grid, and touch states
├── script.js    # LocalStorage handling, CRUD logic, search & filter
└── README.md    # Project documentation
```

## 📄 License

MIT
