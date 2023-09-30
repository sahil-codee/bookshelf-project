import React, { useState } from "react";
import debounce from "lodash.debounce";
import './bookshelf.css'
import bookshelf from "../../Assets/Images/bookshelf.jpg";

function SearchBooks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);

  const handleSearch = debounce(async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=AIzaSyCzzxQT9OqwPgiwzWQOLZWHOfJAHXY1UHA`
      );
      const data = await response.json();
      console.log("Data from Google Books API:", data); // Log the data received from the API
      setBooks(data.items || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, 1000);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddToDashboard = async (book) => {
    const token = localStorage.getItem("token");
  
    // Log pageCount using optional chaining
    console.log("Page Count:", book.volumeInfo?.pageCount);
  
    // Check if pageCount is available before using it
    if (book.volumeInfo?.pageCount) {
      // It's safe to use pageCount here
      console.log("Page Count is available:", book.volumeInfo.pageCount);
    } else {
      // Handle the case where pageCount is not available
      console.log("Page Count is not available for this book.");
    }
  
    try {
      const response = await fetch("http://localhost:3001/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ book }), // Send the entire book data to the backend
      });
  
      if (response.ok) {
        console.log("Book added to dashboard!");
      } else {
        console.error("Error adding book to dashboard");
      }
    } catch (error) {
      console.error("Error adding book to dashboard:", error);
    }
  };
  
  

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
              <img
                src={book.volumeInfo.imageLinks?.smallThumbnail || ""}
                alt=""
              />{" "}
              <h3 className="book-title">{book.volumeInfo.title}</h3>
              <p className="book-authors">
                {book.volumeInfo.authors
                  ? book.volumeInfo.authors.join(", ")
                  : "Unknown Author"}
              </p>
              {book.volumeInfo.averageRating && (
                <p className="book-rating">
                  Rating: {book.volumeInfo.averageRating}/5
                </p>
              )}
              {book.volumeInfo.pageCount && (
                <p>Pages: {book.volumeInfo.pageCount}</p>
              )}
              {book.volumeInfo.ratingsCount && (
                <p className="book-reviews">
                  Reviews: {book.volumeInfo.ratingsCount}
                </p>
              )}
              <button onClick={() => handleAddToDashboard(book)}>
                Add to Dashboard
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchBooks;
