import React, { useState } from "react";
import debounce from "lodash.debounce";

function GoogleBooksApp() {
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
      <input
        type="text"
        placeholder="Search for books..."
        value={searchTerm}
        onChange={handleChange}
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        <h2>Books</h2>
        <ul>
          {books.map((book) => (
            <li key={book.id}>{book.volumeInfo.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GoogleBooksApp;
