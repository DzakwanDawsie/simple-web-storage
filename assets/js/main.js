function loadNoBookAlert() {
  const bookshelfDiv = document.getElementById('bookshelf');

  const noBookDiv = document.createElement('div');
  noBookDiv.className = 'no-book';
  
  const noBookSpan = document.createElement('span');
  noBookSpan.className = 'note';
  noBookSpan.innerText = '~ Bookshelf is empty ~';

  noBookDiv.appendChild(noBookSpan);

  bookshelfDiv.appendChild(noBookDiv);
}

function loadBooks(query = {}) {
  const selectedMenu = document.querySelector('#bookshelfMenu > ul > li.active').children[0].dataset.menu;
  query.isComplete = (selectedMenu == 'completed');
    
  const books = getBooks(query);
  const bookshelfDiv = document.getElementById('bookshelf');
  bookshelfDiv.innerHTML = '';

  if (books.length <= 0) return loadNoBookAlert();

  for (const book of books) {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book';
    
    const bookTitleSpan = document.createElement('span');
    bookTitleSpan.className = 'book-title';
    bookTitleSpan.innerText = book.title || 'Undefined';

    bookDiv.appendChild(bookTitleSpan);

    const bookAuthorSpan = document.createElement('span');
    bookAuthorSpan.className = 'book-author';
    bookAuthorSpan.innerText = 'Author: ' + (book.author || 'Undefined');

    bookDiv.appendChild(bookAuthorSpan);

    const bookReleaseYearSpan = document.createElement('span');
    bookReleaseYearSpan.className = 'book-release-year';
    bookReleaseYearSpan.innerText = 'Released year: ' + (book.year || 'Undefined');

    bookDiv.appendChild(bookReleaseYearSpan);

    const bookActionDiv = document.createElement('div');
    bookActionDiv.className = 'book-action';

    const bookActionCompleteButton = document.createElement('button');
    bookActionCompleteButton.className = 'book-action-complete';
    bookActionCompleteButton.innerText = (!book.isComplete) ? 'Mark as Completed' : 'Mark as Currently Reading';

    bookActionCompleteButton.addEventListener('click', function() {
      markBookAsCompleted(book.id, !book.isComplete);
      loadBooks();
    });

    bookActionDiv.appendChild(bookActionCompleteButton);

    const bookActionEditButton = document.createElement('button');
    bookActionEditButton.className = 'book-action-edit';
    bookActionEditButton.innerText = 'Edit Book';

    bookActionEditButton.addEventListener('click', function() {
      editBook(book);
    });

    bookActionDiv.appendChild(bookActionEditButton);

    const bookActionDeleteButton = document.createElement('button');
    bookActionDeleteButton.className = 'book-action-delete';
    bookActionDeleteButton.innerText = 'Delete book';

    bookActionDeleteButton.addEventListener('click', function() {
      deleteBook(book.id);
      loadBooks();
    });

    bookActionDiv.appendChild(bookActionDeleteButton);

    bookDiv.appendChild(bookActionDiv);

    bookshelfDiv.appendChild(bookDiv);
  }
}

function clearForm() {
  document.querySelector('input[name="id"]').value = '';
  document.querySelector('input[name="title"]').value = '';
  document.querySelector('input[name="author"]').value = '';
  document.querySelector('input[name="year"]').value = '';
  document.querySelector('input[name="completed"]').checked = false;
}


function showBookForm(method = 'Create', show = true) {
  document.getElementById('bookFormBox').style.display = (show) ? 'block' : 'none';

  document.querySelector('#bookForm > input[name=method]').value = method;
}

function editBook(book) {
  document.querySelector('input[name="id"]').value = book.id;
  document.querySelector('input[name="title"]').value = book.title;
  document.querySelector('input[name="author"]').value = book.author;
  document.querySelector('input[name="year"]').value = book.year;
  document.querySelector('input[name="completed"]').checked = book.isComplete;

  showBookForm('Edit');
}

document.getElementById('searchInput').addEventListener('keyup', function(e) {
  if (this.value.length > 0) loadBooks({ title: this.value });
  else loadBooks();
})

document.getElementById('bookFormBox').addEventListener('click', function() {
  showBookForm('Created', false);
  clearForm();
})

document.getElementById('bookFormBox').children[0].addEventListener('click', function(e) {
  e.stopPropagation();
})

document.getElementById('bookForm').addEventListener('submit', function(e) {
  const id = this.querySelector('input[name="id"]').value;
  const title = this.querySelector('input[name="title"]').value;
  const author = this.querySelector('input[name="author"]').value;
  const year = this.querySelector('input[name="year"]').value;
  const isComplete = this.querySelector('input[name="completed"]').checked;
  const method = this.querySelector('input[name="method"]').value;

  if (!title || !author || !year) return alert('Title, author, year is required!');

  if (isNaN(year)) return alert('Year is should be a number');

  let statusSubmit = false;

  if (method == 'Create') statusSubmit = storeBook(title, author, year, isComplete);
  else statusSubmit = updateBook(id, title, author, year, isComplete);

  loadBooks();
  showBookForm(method, false);
  clearForm();

  if (!statusSubmit) alert(`${method} book failed!`);

  e.preventDefault();
  return false;
})

const bookshelfMenus = document.querySelectorAll('#bookshelfMenu > ul > li > a');
bookshelfMenus.forEach(element => {
  element.addEventListener('click', function() {
    const menuType = this.dataset.menu;

    bookshelfMenus.forEach(({parentElement}) => {
      parentElement.className = (parentElement.children[0].dataset.menu == menuType) ? 'active' : '';
    });

    loadBooks();
  });
})

document.getElementById('showCreateBookBtn').addEventListener('click', function() {
  showBookForm('Create');
})

document.addEventListener('DOMContentLoaded', function() {
  loadBooks();
})