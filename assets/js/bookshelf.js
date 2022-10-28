const BOOKSHELF_STORAGE_KEY = 'z-bookshelft';
const BOOKSHELF_BOOK_STORAGE_KEY = BOOKSHELF_STORAGE_KEY.concat('-', 'books');

function checkCompability() {
  if (typeof(Storage) === 'undefined') return false;

  return true;
}

function getBooks(query = {}) {
  const stringifyBooks = localStorage.getItem(BOOKSHELF_BOOK_STORAGE_KEY);
  let books = JSON.parse(stringifyBooks ?? '[]');

  if (query.isComplete != undefined) books = books.filter(book => book.isComplete == query.isComplete);

  if (query.title != undefined) books = books.filter(book => book.title.toLowerCase().includes(query.title.toLowerCase()));

  return [ ...books ];
}

function getBookById(id) {
  const books = getBooks();
  const selectedBook = books.find(book => book.id = id);

  return selectedBook;
}

function storeBook(title, author, year, isComplete) {
  const id = Date.now();
  const book = { id, title, author, year, isComplete };

  const currentBooks = getBooks();
  currentBooks.push(book);

  const stringifyBooks = JSON.stringify(currentBooks);

  try {
    localStorage.setItem(BOOKSHELF_BOOK_STORAGE_KEY, stringifyBooks);
    return true;
  } catch (err) {
    console.error('Storage Exception: ' + err);
    return false;
  }
}

function updateBook(id, title, author, year, isComplete) {  
  const currentBooks = getBooks();
  const selectedBookIndex = currentBooks.findIndex(book => book.id == id);

  currentBooks[selectedBookIndex] = { id, title, author, year, isComplete };

  const stringifyBooks = JSON.stringify(currentBooks);

  try {
    localStorage.setItem(BOOKSHELF_BOOK_STORAGE_KEY, stringifyBooks);
    return true;
  } catch (err) {
    console.error('Storage Exception: ' + err);
    return false;
  }
}

function markBookAsCompleted(id, isComplete = true) {
  const currentBooks = getBooks();
  const selectedBookIndex = currentBooks.findIndex(book => book.id == id);
  
  currentBooks[selectedBookIndex].isComplete = isComplete;

  const stringifyBooks = JSON.stringify(currentBooks);  

  try {
    localStorage.setItem(BOOKSHELF_BOOK_STORAGE_KEY, stringifyBooks);
    return true;
  } catch (err) {
    console.error('Storage Exception: ' + err);
    return false;
  }
}

function deleteBook(id) {
  const currentBooks = getBooks();
  const selectedBookIndex = currentBooks.findIndex(book => book.id == id);

  currentBooks.splice(selectedBookIndex, 1);

  const stringifyBooks = JSON.stringify(currentBooks);

  try {
    localStorage.setItem(BOOKSHELF_BOOK_STORAGE_KEY, stringifyBooks);
    return true;
  } catch (err) {
    console.error('Storage Exception: ' + err);
    return false;
  }
}