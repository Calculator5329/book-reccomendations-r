import React, { useState, useEffect, useRef } from "react";

function LazyImage({ src, alt, fallback, style }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef(null);
  
  useEffect(() => {
    // Create an observer to detect when image enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Start loading the image
          setImageSrc(src);
          // Stop observing once we've started loading
          observer.unobserve(imgRef.current);
        }
      },
      {
        rootMargin: "100px", // Start loading when image is 100px from viewport
      }
    );

    // Start observing the image element
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    // Cleanup observer
    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  // Handle image error
  const onError = () => {
    console.warn(`Failed to load image: ${src}`);
    setImageSrc(fallback);
    setIsLoading(false);
  };

  // Handle image load complete
  const onLoad = () => {
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
            backgroundColor: "#eee" 
          }}
        >
          <span>Loading...</span>
        </div>
      )}
      
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          style={{
            ...style,
            display: isLoading ? "none" : "block"
          }}
          onError={onError}
          onLoad={onLoad}
        />
      )}
    </div>
  );
}

export default LazyImage;