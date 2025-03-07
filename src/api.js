import axios from "axios";

const API_BASE = "https://faiss-app-p2s3lyhluq-uc.a.run.app"; // Flask backend URL

export const getBooks = async () => {
  try {
    const response = await fetch("/data/books.json"); // Load from local file
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading books.json:", error);
    return [];
  }
};


export const getRecommendations = async (likedBooks) => {
    try {
      console.log("Requesting recommendations for books:", likedBooks);
      
      const response = await axios.post(`${API_BASE}/recommendations`, {
        likedBooks: likedBooks
      });
      
      console.log("Raw recommendation response:", response);
      
      // Get the response data
      let recommendations = response.data;
      
      // Handle string responses (shouldn't happen with JSON API but just in case)
      if (typeof recommendations === 'string') {
        try {
          recommendations = JSON.parse(recommendations);
          console.log("Parsed string recommendations into:", recommendations);
        } catch (parseError) {
          console.error("Error parsing recommendations data:", parseError);
        }
      }
      
      // Log the recommendations count
      console.log(`Processing ${recommendations ? recommendations.length : 0} recommendations`);
      
      // Ensure we have an array
      if (Array.isArray(recommendations)) {
        if (recommendations.length === 0) {
          console.warn("Received empty recommendations array");
        }
        return recommendations;
      } else if (recommendations && typeof recommendations === 'object') {
        const values = Object.values(recommendations);
        console.log(`Converted object to array with ${values.length} items`);
        return values;
      }
      
      console.warn("Returning empty recommendations array");
      return [];
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      // Log more detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
      return [];
    }
  };
