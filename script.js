// Récupération des éléments du DOM
const addBookBtn = document.getElementById('add-book-btn');
const modal = document.getElementById('add-book-modal');
const closeBtn = document.querySelector('.close');
const addBookForm = document.getElementById('add-book-form');
const bookList = document.getElementById('book-list');

// Écouteur d'événements pour ouvrir le modal
addBookBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Écouteur d'événements pour fermer le modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Écouteur d'événements pour ajouter un livre
addBookForm.addEventListener('submit', addBook);

// Fonction pour ajouter un livre
function addBook(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const id = Date.now().toString(); // Génération d'un ID unique

    const book = {
        id,
        title,
        author,
        read: false // Par défaut, le livre n'est pas lu
    };

    // Ajout du livre à la liste
    addBookToLibrary(book);

    // Sauvegarde des livres dans le localStorage
    saveBooksToLocalStorage();

    // Fermeture du modal
    modal.style.display = 'none';

    // Effacer les champs du formulaire
    addBookForm.reset();
}

// Fonction pour ajouter un livre à la liste
function addBookToLibrary(book) {
    const bookItem = document.createElement('div');
    bookItem.classList.add('book-item');
    bookItem.innerHTML = `
        <span class="book-id">${book.id}</span>
        <h3>${book.title}</h3>
        <p>par ${book.author}</p>
        <button class="read-btn">Marquer comme Lu</button>
        <button class="remove-btn">Supprimer</button>
    `;
    bookList.appendChild(bookItem);

    // Ajouter des écouteurs d'événements pour marquer comme lu et supprimer
    const readBtn = bookItem.querySelector('.read-btn');
    const removeBtn = bookItem.querySelector('.remove-btn');

    readBtn.addEventListener('click', () => {
        toggleReadStatus(book);
    });

    removeBtn.addEventListener('click', () => {
        removeBook(book);
    });
}

// Fonction pour changer le statut de lecture
function toggleReadStatus(book) {
    book.read = !book.read;
    const bookItem = document.querySelector(`.book-item .book-id:contains("${book.id}")`).parentNode;
    const title = bookItem.querySelector('h3');
    if (book.read) {
        title.classList.add('read');
    } else {
        title.classList.remove('read');
    }
    saveBooksToLocalStorage();
}

// Fonction pour supprimer un livre
function removeBook(book) {
    const bookItem = document.querySelector(`.book-item .book-id:contains("${book.id}")`).parentNode;
    bookItem.remove();
    saveBooksToLocalStorage();
}

// Fonction pour sauvegarder les livres dans le localStorage
function saveBooksToLocalStorage() {
    const books = Array.from(document.querySelectorAll('.book-item')).map(bookItem => {
        const id = bookItem.querySelector('.book-id').textContent;
        const title = bookItem.querySelector('h3').textContent;
        const author = bookItem.querySelector('p').textContent.replace('par ', '');
        const read = bookItem.querySelector('.read') !== null;
        return { id, title, author, read };
    });
    localStorage.setItem('books', JSON.stringify(books));
}

// Chargement des livres depuis le localStorage au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    books.forEach(book => {
        addBookToLibrary(book);
    });
});g
