import { decorate, observable, computed } from "mobx";
import axios from "axios";

const instance = axios.create({
  baseURL: "https://the-index-api.herokuapp.com"
});

class BookStore {
  constructor() {
    this.loading = true;
    this.query = "";
    this.books = [];
  }
  changeAvailable(book) {
    book.available = !book.available;
  }
  fetchBooks() {
    return instance
      .get("/api/books/")
      .then(res => res.data)
      .then(books => {
        this.books = books;
        this.loading = false;
      })
      .catch(err => console.error(err));
  }

  get filteredBooks() {
    return this.books.filter(book =>
      book.title.toLowerCase().includes(this.query)
    );
  }

  filterBooksByColor(bookColor) {
    return this.filteredBooks.filter(book => book.color === bookColor);
  }
}

decorate(BookStore, {
  loading: observable,
  query: observable,
  filteredBooks: computed,
  books: observable
});

const bookStore = new BookStore();

bookStore.fetchBooks();

export default bookStore;
