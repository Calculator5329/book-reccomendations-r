import React, { useMemo, useCallback } from "react";
import LazyImage from "./LazyImage";
import "../styles/Book.css";

const BookCard = React.memo(
  ({ book, isLiked, onToggleLike, onClick }) => {
    const imageStyle = useMemo(
      () => ({
        width: "120px",
        height: "180px",
        objectFit: "cover",
        borderRadius: "5px",
      }),
      []
    );

    // Memoize the click handler for like button
    const handleToggleLike = useCallback(
      (e) => {
        e.stopPropagation();
        onToggleLike(book.Title);
      },
      [onToggleLike, book.Title]
    );

    // You can also memoize the onClick for selecting the book
    const handleClick = useCallback(() => {
      onClick(book);
    }, [onClick, book]);

    return (
      <div
        className="book-card"
        onClick={handleClick}
        style={{ width: "180px", height: "320px" }}
      >
        <LazyImage
          src={book.image}
          alt={book.Title}
          fallback="https://via.placeholder.com/120x180?text=No+Image"
          style={imageStyle}
        />
        <div style={{ height: "50px", overflow: "hidden" }}>
          <h3
            style={{ fontSize: "16px", fontWeight: "bold", margin: "10px 0" }}
          >
            {book.Title.length > 30
              ? book.Title.substring(0, 30) + "..."
              : book.Title}
          </h3>
        </div>
        <button
          onClick={handleToggleLike}
          style={{
            padding: "8px 14px",
            fontSize: "14px",
            backgroundColor: isLiked ? "rgb(0, 0, 0)" : "rgb(0, 0, 0)",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background 0.2s",
            marginTop: "15px",
          }}
        >
          {isLiked ? "Unlike" : "Like"}
        </button>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if the book reference or the like state changes
    return (
      prevProps.book === nextProps.book &&
      prevProps.isLiked === nextProps.isLiked &&
      prevProps.onToggleLike === nextProps.onToggleLike &&
      prevProps.onClick === nextProps.onClick
    );
  }
);

export default BookCard;
