import React, { useState } from "react";
import debounce from "lodash.debounce";
import "../App.css";
import bookshelf from "../Assets/Images/bookshelf.jpg";
import { useReadingList } from "./ReadingListContext ";

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

  const { addToReadingList } = useReadingList();

  const handleAddToReadingList = async (book) => {
    try {
      // Create an object with the necessary data from the book
      const bookData = {
        bookTitle: book.volumeInfo.title,
        bookAuthors: book.volumeInfo.authors || [],
        bookImage: book.volumeInfo.imageLinks?.smallThumbnail || "",
      };

      addToReadingList({
        bookTitle: book.volumeInfo.title,
        bookAuthors: book.volumeInfo.authors || [],
        bookImage: book.volumeInfo.imageLinks?.smallThumbnail || "",
      });
      // Send a POST request to your backend endpoint
      const response = await fetch("http://localhost:3001/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        // Handle success, e.g., show a success message
        console.log("Book added to reading list");
      } else {
        // Handle error cases
        console.error("Error adding book to reading list");
      }
    } catch (error) {
      console.error("Error adding book to reading list:", error);
    }
  }; // Missing curly brace

  return (
    <div>
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
              <button
                onClick={() => handleAddToReadingList(book)}
                className="add-to-reading-list-button"
              >
                Add to Reading List
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchBooks;
