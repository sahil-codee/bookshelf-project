import React, { useEffect, useState } from "react";
import Rating from "react-rating-stars-component";
import "./dashboard.css";
import { BASE_URL } from "../services/helper";

function Dashboard() {
  const [addedBooks, setAddedBooks] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  useEffect(() => {
    // Fetch user's dashboard data
    const token = localStorage.getItem("token");
  
    if (token) {
      const fetchData = async () => {
        try {
          const response = await fetch("http://localhost:3001/dashboard", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.status === 401) {
            // Token has expired or is invalid, redirect to the login page
            window.location.href = "/login"; // Replace with the actual login page URL
            return; // Stop further processing
          }
  
          if (response.ok) {
            const data = await response.json();
            console.log(data);
  
            // Reset the pagesRead value to an empty string
            const updatedBooks = data.books.map((book) => ({
              ...book,
              pagesRead: "",
            }));
  
            setAddedBooks(updatedBooks);
          } else {
            console.error("Error fetching added books for dashboard");
          }
        } catch (error) {
          console.error("Error fetching added books for dashboard:", error);
        }
      };
  
      fetchData(); // Call the function
    }
  }, []);
  
  const handleRatingChange = async (book, rating) => {
    const token = localStorage.getItem("token");
    const updatedBook = {
      _id: book._id, // Include the book's _id
      averageRating: rating,
    };

    try {
      const response = await fetch(
        `${BASE_URL}/dashboard/update-rating`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ book: updatedBook }),
        }
      );

      if (response.ok) {
        // Update the book's rating in the state
        setAddedBooks((prevBooks) =>
          prevBooks.map((prevBook) =>
            prevBook._id === updatedBook._id
              ? { ...prevBook, averageRating: rating }
              : prevBook
          )
        );
      } else {
        console.error("Error adding/updating book rating");
      }
    } catch (error) {
      console.error("Error adding/updating book rating:", error);
    }
  };

  const handleMarkAsFinished = async (book) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${BASE_URL}/dashboard/remove-book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookId: book._id }),
        }
      );

      if (response.ok) {
        // Remove the book from the state
        setAddedBooks((prevBooks) =>
          prevBooks.filter((prevBook) => prevBook._id !== book._id)
        );
      } else {
        console.error("Error removing book");
      }
    } catch (error) {
      console.error("Error removing book:", error);
    }
  };

  const handleProgressUpdate = async (book, pagesRead) => {
    const token = localStorage.getItem("token");
  
    if (!pagesRead || parseInt(pagesRead) === 0) {
      setErrorMessage("Please enter a valid value for pages read.");
  
      // Clear the error message after 5 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
  
      return;
    }
  
    setErrorMessage("");
  
    const updatedBook = {
      _id: book._id,
      pagesRead: pagesRead,
      lastProgressUpdate: new Date(),
    };
  
    updatedBook.progress = pagesRead / book.pageCount;
  
    try {
      const response = await fetch(
        `${BASE_URL}/dashboard/update-progress`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ book: updatedBook }),
        }
      );
  
      if (response.ok) {
        setAddedBooks((prevBooks) =>
          prevBooks.map((prevBook) =>
            prevBook._id === updatedBook._id
              ? { ...prevBook, ...updatedBook, pagesRead: "" } // Clear the pagesRead value
              : prevBook
          )
        );
      } else {
        console.error("Error updating book progress");
      }
    } catch (error) {
      console.error("Error updating book progress:", error);
    }
  };
  
  const handlePagesReadChange = (book, pagesRead) => {
    // Update the pagesRead value in the book object in the state
    setAddedBooks((prevBooks) =>
      prevBooks.map((prevBook) =>
        prevBook._id === book._id
          ? { ...prevBook, pagesRead: pagesRead }
          : prevBook
      )
    );
  };

  return (
    <div>
      <br />
      <h1>Currently Reading</h1>
      <br />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}{" "}
      {/* Display error message */}
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Author</th>
            <th>Rating</th>
            <th colSpan={2} style={{ textAlign: "center" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {addedBooks.map((book) => (
            <tr key={book._id}>
              <td>
                <img src={book.image} alt="" />
              </td>
              <td className="book-title">{book.title}</td>
              <td className="book-authors">{book.author}</td>
              <td>
                <Rating
                  count={5}
                  size={24}
                  value={book.averageRating || 0}
                  onChange={(rating) => handleRatingChange(book, rating)}
                />
              </td>
              <td>
                <button onClick={() => handleMarkAsFinished(book)}>
                  I'm Finished!
                </button>
              </td>
              <td>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="number"
                    className="pages-read-input"
                    placeholder="Pages Read"
                    value={book.pagesRead || ""}
                    onChange={(e) =>
                      handlePagesReadChange(book, e.target.value)
                    }
                  />
                  &nbsp;out of&nbsp;{book.pageCount}
                </div>

                <button
                  onClick={() => handleProgressUpdate(book, book.pagesRead)}
                >
                  Update Progress
                </button>
                {book.progress !== undefined && (
                  <p>
                    Progress: {Math.round(book.progress * 100)}%{" "}
                    {/* Display rounded percentage */}
                  </p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
