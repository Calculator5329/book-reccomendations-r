import React, { useState, useEffect, useRef } from "react";

// Simple cache for loaded images
const imageCache = new Map();

function LazyImage({ src, alt, fallback, style }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef(null);

  useEffect(() => {
    // If the image is already loaded, skip lazy loading
    if (imageCache.has(src)) {
      setImageSrc(src);
      setIsLoading(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.unobserve(imgRef.current);
        }
      },
      {
        rootMargin: "100px",
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  const onError = () => {
    console.warn(`Failed to load image: ${src}`);
    setImageSrc(fallback);
    setIsLoading(false);
  };

  const onLoad = () => {
    imageCache.set(src, true);
    setIsLoading(false);
  };

  return (
    <div ref={imgRef} style={{ ...style, backgroundColor: "#f0f0f0" }}>
      {isLoading && !imageSrc && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#eee",
          }}
        >
          <span>Loading...</span>
        </div>
      )}

      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          style={{ ...style, display: isLoading ? "none" : "block" }}
          onError={onError}
          onLoad={onLoad}
        />
      )}
    </div>
  );
}

export default React.memo(LazyImage);
