import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getBooks, getRecommendations } from "./api";
import BookDetail from "./components/BookDetail";
import { debounce } from "lodash";
import BookList from "./components/BookList";
import "./styles/Book.css";
import profilePic from "./profile.png";

function App() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [likedBooks, setLikedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Recommendations state
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Pagination for books rows
  const [currentRow, setCurrentRow] = useState(0); // For books
  const [currentRecommendationRow, setCurrentRecommendationRow] = useState(0); // For recommendations

  const booksPerRow = 6; // Show 6 books per row

  // Debounced selection handler
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSelectBook = useCallback(
    debounce((book) => {
      setSelectedBook((prevBook) =>
        prevBook?.Title === book.Title ? prevBook : book
      );
    }, 300),
    []
  );

  useEffect(() => {
    setLoading(true);
    getBooks()
      .then((data) => {
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          console.error("API did not return an array:", data);
          setBooks([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
        setError("Failed to load books. Please try again.");
        setLoading(false);
      });
  }, []);

  const toggleLike = (bookTitle) => {
    setLikedBooks((prevLikedBooks) =>
      prevLikedBooks.includes(bookTitle)
        ? prevLikedBooks.filter((title) => title !== bookTitle)
        : [...prevLikedBooks, bookTitle]
    );
  };

  // Function to fetch recommendations
  const fetchRecommendations = async () => {
    if (likedBooks.length === 0) {
      alert("Please like at least one book first");
      return;
    }

    setLoadingRecommendations(true);
    try {
      const recommendedBooks = await getRecommendations(likedBooks);
      setRecommendations(recommendedBooks);
      setCurrentRecommendationRow(0); // Reset to first row of recommendations
      // Clear liked books after recommendations are calculated
      setLikedBooks([]);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      alert("Failed to get recommendations. Please try again.");
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Calculate which books to display in the current row
  const totalBookRows = Math.ceil(books.length / booksPerRow);
  const totalRecommendationRows = Math.ceil(
    recommendations.length / booksPerRow
  );

  // For Books
  const goToNextRow = () => {
    if (currentRow < totalBookRows - 1) setCurrentRow(currentRow + 1);
  };
  const goToPrevRow = () => {
    if (currentRow > 0) setCurrentRow(currentRow - 1);
  };

  // For Recommendations
  const goToNextRecommendationRow = () => {
    if (currentRecommendationRow < totalRecommendationRows - 1)
      setCurrentRecommendationRow(currentRecommendationRow + 1);
  };
  const goToPrevRecommendationRow = () => {
    if (currentRecommendationRow > 0)
      setCurrentRecommendationRow(currentRecommendationRow - 1);
  };

  // Function to truncate text
  const truncateText = (text, maxLength = 25) => {
    if (!text) return "Untitled";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1600px",
        margin: "0 auto",
      }}
    >
      <div className="top-bar">
        {" "}
        {/* Flex container */}
        <a
          href="https://Calculator5329.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="avatar-link"
        >
          <div className="profile-avatar">
            <img src={profilePic} alt="Me" />
          </div>
        </a>
        <header className="app-header">📚 Book Recommendation App</header>
        {/* Add this empty div as a spacer */}
        <div className="top-bar-spacer"></div>
      </div>
      {/* Top Section: Book Details & Liked Books */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Book Details */}
        <div
          style={{
            flex: 2,
            padding: "15px",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            maxWidth: "1200px",
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(30, 30, 30, 1))",
            color: "#f9e9c9",
          }}
        >
          {selectedBook ? (
            <BookDetail book={selectedBook} />
          ) : (
            <p>Select a book to see details.</p>
          )}
        </div>

        {/* Liked Books */}
        <div
          style={{
            flex: 1,
            padding: "15px",
            borderRadius: "5px",
            maxWidth: "350px",
            background:
              "linear-gradient(to bottom,rgba(0, 0, 0, 1),  rgba(30, 30, 30, 1))",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            color: "#f9e9c9",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h2 style={{ margin: 0 }}>Liked Books</h2>

            {/* Calculate Recommendations Button */}
            <button
              onClick={fetchRecommendations}
              disabled={loadingRecommendations || likedBooks.length === 0}
              style={{
                padding: "8px 12px",
                fontSize: "14px",
                backgroundColor: "rgba(0, 0, 0, 1)",
                color: "#f9e9c9",
                border: "#f9e9c966 2px solid",
                borderRadius: "4px",
                cursor: likedBooks.length === 0 ? "not-allowed" : "pointer",
                opacity: likedBooks.length === 0 ? 0.8 : 1,
              }}
            >
              {loadingRecommendations ? "Loading..." : "Get Recommendations"}
            </button>
          </div>

          {likedBooks.length > 0 ? (
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              <ul style={{ padding: 0, listStyleType: "none" }}>
                {likedBooks.map((title, index) => (
                  <li
                    key={index}
                    style={{ marginBottom: "5px", fontSize: "14px" }}
                  >
                    {truncateText(title, 50)}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No books liked yet.</p>
          )}
        </div>
      </div>
      {/* Books Section */}
      <h2 className="book-header">Books</h2>
      <BookList
        books={books}
        currentRow={currentRow}
        totalRows={totalBookRows}
        goToPrevRow={goToPrevRow}
        goToNextRow={goToNextRow}
        listType="book"
        likedBooks={likedBooks}
        toggleLike={toggleLike}
        selectBook={debouncedSelectBook}
        booksPerRow={booksPerRow}
      />
      {recommendations.length > 0 && (
        <>
          <h2 className="book-header">Recommendations For You</h2>
          <BookList
            books={recommendations}
            currentRow={currentRecommendationRow}
            totalRows={totalRecommendationRows}
            goToPrevRow={goToPrevRecommendationRow}
            goToNextRow={goToNextRecommendationRow}
            listType="recommendation"
            likedBooks={likedBooks}
            toggleLike={toggleLike}
            selectBook={debouncedSelectBook}
            booksPerRow={booksPerRow}
          />
        </>
      )}
    </div>
  );
}

export default App;
