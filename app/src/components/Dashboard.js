import React, { useEffect, useState } from "react";

import { useAuth } from "./AuthContext";
import { useReadingList } from "./ReadingListContext ";

function Dashboard({ username }) {
  const { authUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      setIsLoading(false);
    }
  }, [authUser]);
  const { readingList } = useReadingList();

  
  return (
    <div className="dashboard-container">
      {isLoading ? (
        <p>Loading...</p>
      ) : authUser ? (
        <h1>Welcome, {authUser.username}!</h1>
      ) : (
        <p>Please log in to access the dashboard.</p>
      )}
      <ul>
        {readingList.map((book, index) => (
          <li key={index}>
            <img src={book.bookImage} alt="" />
            <h4>{book.bookTitle}</h4>
            <p>{book.bookAuthors.join(", ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
