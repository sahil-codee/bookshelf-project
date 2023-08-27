import React, { useState } from "react";
import debounce from "lodash.debounce";
import "../App.css";
import bookshelf from "../Assets/Images/bookshelf.jpg";

function SearchBooks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);

  const handleSearch = debounce(async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=AIzaSyCzzxQT9OqwPgiwzWQOLZWHOfJAHXY1UHA`
      );
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, 1000);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <h1>Google Books Search</h1>
      <div className="container">
        <img className="image" src={bookshelf} alt="SampleImage" />
        <div className="overlay">
          <div className="overlay-content">
            <div className="search-container">
              <input
                className="search-input"
                type="text"
                placeholder="Search for books..."
                value={searchTerm}
                onChange={handleChange}
              />
              <button className="search-button" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="book-list">
        <div className="book-cards">
          {books.map((book) => (
            <div className="book-card" key={book.id}>
              <img src={book.volumeInfo.imageLinks.smallThumbnail} alt="" />
              <h3 className="book-title">{book.volumeInfo.title}</h3>
              <p className="book-authors">
                {book.volumeInfo.authors
                  ? book.volumeInfo.authors.join(", ")
                  : "Unknown Author"}
              </p>
              {/* Add more details if needed */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchBooks;
