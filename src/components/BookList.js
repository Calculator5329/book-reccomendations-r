import React, { useMemo } from "react";
import BookCard from "./BookCard";
import "../styles/Book.css";
import "../styles/Pagination.css";

const BookList = React.memo(
  ({
    books,
    currentRow,
    totalRows,
    goToPrevRow,
    goToNextRow,
    likedBooks,
    toggleLike,
    selectBook,
    booksPerRow,
  }) => {
    const startIndex = currentRow * booksPerRow;
    const endIndex = startIndex + booksPerRow;
    const currentBooks = useMemo(
      () => books.slice(startIndex, endIndex),
      [books, startIndex, endIndex]
    );

    return (
      <div
        style={{
          position: "relative",
          padding: "0 40px",
          marginBottom: "20px",
        }}
      >
        {/* Left Arrow */}
        <button
          onClick={goToPrevRow}
          disabled={currentRow === 0}
          className={`carousel-button carousel-button-left`} // Apply the global CSS class
        ></button>

        <div className="book-grid">
          {currentBooks.map((book, index) => (
            <BookCard
              key={`${book.Title || "untitled"}-${index}`}
              book={book}
              isLiked={likedBooks.includes(book.Title)}
              onToggleLike={toggleLike}
              onClick={selectBook}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={goToNextRow}
          disabled={currentRow >= totalRows - 1}
          className={`carousel-button carousel-button-right`} // Apply the global CSS class
        ></button>

        {/* Pagination Indicator */}
        <div className="pagination-text">
          {currentRow + 1} of {totalRows} rows
        </div>
      </div>
    );
  }
);

export default BookList;
