import React from "react";

const BookImage = React.memo(({ book, onSelect, isLiked, onToggleLike }) => {
  return (
    <div>
      <img
        src={book.imageUrl}
        alt={book.title}
        onClick={() => onSelect(book)}
      />
      <button onClick={() => onToggleLike(book.title)}>
        {isLiked ? "Unlike" : "Like"}
      </button>
    </div>
  );
});

export default BookImage;
