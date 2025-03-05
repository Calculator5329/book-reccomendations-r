import React, { useEffect, useState, useCallback } from "react";
import { getBooks, getRecommendations } from "./api";
import BookDetail from "./BookDetail";
import LazyImage from "./LazyImage";
import { debounce } from "lodash";

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
  const [currentRow, setCurrentRow] = useState(0);
  const booksPerRow = 6; // Show 6 books per row
  
  // Pagination for recommendations rows
  const [currentRecommendationRow, setCurrentRecommendationRow] = useState(0);

  // Debounced selection handler
  const debouncedSelectBook = useCallback(
    debounce((book) => {
      setSelectedBook(book);
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
  const totalRows = Math.ceil(books.length / booksPerRow);
  const startIndex = currentRow * booksPerRow;
  const endIndex = startIndex + booksPerRow;
  const currentBooks = books.slice(startIndex, endIndex);

  // Calculate which recommendations to display
  const totalRecommendationRows = Math.ceil(recommendations.length / booksPerRow);
  const recommendationStartIndex = currentRecommendationRow * booksPerRow;
  const recommendationEndIndex = recommendationStartIndex + booksPerRow;
  const currentRecommendations = recommendations.slice(recommendationStartIndex, recommendationEndIndex);

  // Handle row navigation for regular books
  const goToNextRow = () => {
    if (currentRow < totalRows - 1) setCurrentRow(currentRow + 1);
  };

  const goToPrevRow = () => {
    if (currentRow > 0) setCurrentRow(currentRow - 1);
  };

  // Handle row navigation for recommendations
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
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Book card component to reduce duplication
  const BookCard = ({ book, isLiked, onToggleLike, onClick }) => (
    <div
      onClick={onClick}
      style={{
        border: isLiked ? "3px solid blue" : "1px solid gray",
        padding: "10px",
        cursor: "pointer",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        height: "350px", // Fixed height for all book cards
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      <LazyImage 
        src={book.image} 
        alt={book.Title} 
        fallback="https://via.placeholder.com/100x150?text=No+Image"
        style={{ width: "100px", height: "150px", objectFit: "cover", borderRadius: "5px", margin: "0 auto" }}
      />
      <h3 style={{ fontSize: "16px", margin: "10px 0", height: "40px", overflow: "hidden" }}>
        {truncateText(book.Title, 30) || "Untitled Book"}
      </h3>
      <p style={{ fontSize: "14px", marginBottom: "5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        <strong>Author:</strong> {truncateText(book.authors, 20) || "Unknown"}
      </p>
      <p style={{ fontSize: "14px", marginBottom: "10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        <strong>Genre:</strong> {truncateText(book.categories, 20) || "Unknown"}
      </p>

      {/* Spacer to push button to bottom */}
      <div style={{ flexGrow: 1 }}></div>

      {/* Like Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the parent onClick
          onToggleLike(book.Title);
        }} 
        style={{ 
          padding: "5px 10px", 
          fontSize: "12px", 
          backgroundColor: "#007bff", 
          color: "white", 
          border: "none", 
          borderRadius: "3px", 
          cursor: "pointer",
          alignSelf: "center"
        }}
      >
        {isLiked ? "Unlike" : "Like"}
      </button>
    </div>
  );

  // Books row component to reduce duplication
  const BooksRow = ({ books, currentRow, totalRows, goToPrevRow, goToNextRow, likedBooks, onToggleLike, onSelectBook }) => (
    <div style={{ position: "relative", paddingLeft: "40px", paddingRight: "40px", marginBottom: "20px" }}>
      {/* Left Arrow (Fixed Position) */}
      <button 
        onClick={goToPrevRow} 
        disabled={currentRow === 0} 
        style={{
          position: "absolute", 
          left: "0", 
          top: "50%", 
          transform: "translateY(-50%)", 
          padding: "10px", 
          fontSize: "20px", 
          cursor: currentRow === 0 ? "not-allowed" : "pointer", 
          border: "none", 
          background: "none",
          zIndex: 10
        }}
      >
        ◀
      </button>

      {/* Books Row with Fixed Height Cards */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${booksPerRow}, 1fr)`, gap: "15px" }}>
        {books.map((book, index) => (
          <BookCard
            key={`${book.Title || 'untitled'}-${index}`}
            book={book}
            isLiked={likedBooks.includes(book.Title)}
            onToggleLike={onToggleLike}
            onClick={() => onSelectBook(book)}
          />
        ))}
      </div>

      {/* Right Arrow (Fixed Position) */}
      <button 
        onClick={goToNextRow} 
        disabled={currentRow >= totalRows - 1} 
        style={{
          position: "absolute", 
          right: "0", 
          top: "50%", 
          transform: "translateY(-50%)", 
          padding: "10px", 
          fontSize: "20px", 
          cursor: currentRow >= totalRows - 1 ? "not-allowed" : "pointer", 
          border: "none", 
          background: "none",
          zIndex: 10
        }}
      >
        ▶
      </button>
      
      {/* Pagination Indicator */}
      <div style={{ textAlign: "center", marginTop: "15px" }}>
        {currentRow + 1} of {totalRows} rows
      </div>
    </div>
  );

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>Error: {error}</div>;
  if (books.length === 0) return <div>No books found. Please check the database.</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "1600px", margin: "0 auto" }}>
      {/* Updated Header */}
      <header style={{ textAlign: "center", marginBottom: "20px", padding: "10px", fontSize: "28px", fontWeight: "bold", backgroundColor: "#007bff", color: "#fff", borderRadius: "5px" }}>
        Book Recommendation App
      </header>

      {/* Top Section: Book Details & Liked Books */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        
        {/* Book Details */}
        <div style={{ flex: 2, padding: "15px", borderRadius: "5px", backgroundColor: "#f9f9f9", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
          {selectedBook ? <BookDetail book={selectedBook} /> : <p>Select a book to see details.</p>}
        </div>

        {/* Liked Books */}
        <div style={{ flex: 1, padding: "15px", borderRadius: "5px", backgroundColor: "#f9f9f9", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h2 style={{ margin: 0 }}>Liked Books</h2>
            
            {/* Calculate Recommendations Button */}
            <button
              onClick={fetchRecommendations}
              disabled={loadingRecommendations || likedBooks.length === 0}
              style={{
                padding: "8px 12px",
                fontSize: "14px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: likedBooks.length === 0 ? "not-allowed" : "pointer",
                opacity: likedBooks.length === 0 ? 0.7 : 1
              }}
            >
              {loadingRecommendations ? "Loading..." : "Calculate Recommendations"}
            </button>
          </div>
          
          {likedBooks.length > 0 ? (
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              <ul style={{ padding: 0, listStyleType: "none" }}>
                {likedBooks.map((title, index) => (
                  <li key={index} style={{ marginBottom: "5px", fontSize: "14px" }}>{truncateText(title, 50)}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No books liked yet.</p>
          )}
        </div>
      </div>

      {/* Books Section */}
      <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Books</h2>
      <BooksRow
        books={currentBooks}
        currentRow={currentRow}
        totalRows={totalRows}
        goToPrevRow={goToPrevRow}
        goToNextRow={goToNextRow}
        likedBooks={likedBooks}
        onToggleLike={toggleLike}
        onSelectBook={debouncedSelectBook}
      />
      
      {/* Recommendations Section - Only show if recommendations exist */}
      {recommendations.length > 0 && (
        <>
          <h2 style={{ textAlign: "center", marginBottom: "15px", marginTop: "30px" }}>Recommendations For You</h2>
          <BooksRow
            books={currentRecommendations}
            currentRow={currentRecommendationRow}
            totalRows={totalRecommendationRows}
            goToPrevRow={goToPrevRecommendationRow}
            goToNextRow={goToNextRecommendationRow}
            likedBooks={likedBooks}
            onToggleLike={toggleLike}
            onSelectBook={debouncedSelectBook}
          />
        </>
      )}
    </div>
  );
}

export default App;