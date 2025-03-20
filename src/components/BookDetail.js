import React, { memo, useState } from "react";
import LazyImage from "./LazyImage";
import "../styles/BookDetail.css";

const truncateText = (text, maxLength = 25) => {
  if (!text) return "Untitled";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const BookDetail = memo(({ book }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Truncate description if it's too long
  const maxDescriptionLength = 1250;
  const truncatedDescription =
    book.description && book.description.length > maxDescriptionLength
      ? book.description.slice(0, maxDescriptionLength) + "..."
      : book.description;

  return (
    <div className="book-detail">
      {/* Book Image and Info (Left) */}
      <div style={{ flexShrink: 0, textAlign: "center" }}>
        <LazyImage
          src={
            book.image
              ? book.image.replace("http://", "https://")
              : "fallback-image-url"
          }
          alt={book.Title}
          fallback="https://via.placeholder.com/150x200?text=No+Image"
          style={{
            width: "150px",
            height: "200px",
            objectFit: "cover",
            borderRadius: "5px",
          }}
        />
        <p
          style={{
            margin: "10px 0 5px",
            fontSize: "14px",
            textAlign: "left",
          }}
        >
          <strong>Author:</strong>
          {truncateText(book.authors, 20) || "Unknown"}
        </p>
        <p
          style={{
            margin: "10px 0 5px",
            fontSize: "14px",
            textAlign: "left",
          }}
        >
          <strong>Categories:</strong>{" "}
          {truncateText(book.categories, 20) || "Unknown"}
        </p>
      </div>

      {/* Book Description (Right) */}
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
          {book.Title || "Untitled Book"}
        </h2>
        <p
          style={{
            fontSize: "14px",
            lineHeight: "1.4",
            color: "#333",
            marginBottom: "5px",
          }}
        >
          <strong>Description:</strong>{" "}
          {showFullDescription ? book.description : truncatedDescription}
        </p>
        {book.description && book.description.length > maxDescriptionLength && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            style={{
              marginTop: "0px",
              padding: "5px 10px",
              fontSize: "12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            {showFullDescription ? "Show Less" : "Read More"}
          </button>
        )}
      </div>
    </div>
  );
});

export default BookDetail;
