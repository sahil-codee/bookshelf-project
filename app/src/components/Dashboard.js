import React, { useEffect, useState } from "react";
import UpdateProgress from "./UpdateProgress";

function Dashboard() {
  const [addedBooks, setAddedBooks] = useState([]);
  const [openBookId, setOpenBookId] = useState(null);

  const openPopup = (bookId) => {
    setOpenBookId(bookId);
  };

  
  const closePopup = () => {
    setOpenBookId(null);
  };

  useEffect(() => {
    // Decode the token to get user information
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



  return (
    <div>
      <h1>Currently Reading</h1>
      {/* Rest of your dashboard content */}
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Author</th>
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
                <button onClick={() => openPopup(book._id)}>
                  Update Progress
                </button>
                {openBookId === book._id && (
                  <UpdateProgress onClose={closePopup} book={book} />
                )}
                <button>
                  I've Finished
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
