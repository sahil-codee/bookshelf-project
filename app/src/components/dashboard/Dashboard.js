import React, { useEffect, useState } from "react";
import Rating from "react-rating-stars-component";

function Dashboard() {
  const [addedBooks, setAddedBooks] = useState([]);

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
            setAddedBooks(data.books || []);
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
      const response = await fetch("http://localhost:3001/dashboard/update-rating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ book: updatedBook }),
      });
  
      if (response.ok) {
        // Update the book's rating in the state
        setAddedBooks((prevBooks) =>
          prevBooks.map((prevBook) =>
            prevBook._id === updatedBook._id ? { ...prevBook, averageRating: rating } : prevBook
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
      const response = await fetch("http://localhost:3001/dashboard/remove-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId: book._id }),
      });
  
      if (response.ok) {
        // Remove the book from the state
        setAddedBooks((prevBooks) => prevBooks.filter((prevBook) => prevBook._id !== book._id));
      } else {
        console.error("Error removing book");
      }
    } catch (error) {
      console.error("Error removing book:", error);
    }
  };
  
  return (
    <div>
      <h1>Currently Reading</h1>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Author</th>
            <th>Rating</th>
            <th>Actions</th>
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
  <button onClick={() => handleMarkAsFinished(book)}>Mark as Finished</button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
