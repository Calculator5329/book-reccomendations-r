# Book Recommendation System

This project is a Book Recommendation System that leverages OpenAI embeddings and FAISS for efficient similarity search. It provides personalized book recommendations based on summaries and reviews from a dataset of 45,000 books. The system features a Flask backend and a React frontend, deployed on Google Cloud and GitHub Pages, respectively.

## Features

- **Personalized Recommendations**: Utilizes OpenAI embeddings to analyze book summaries and reviews, offering tailored book suggestions.
- **Efficient Similarity Search**: Implements FAISS (Facebook AI Similarity Search) for rapid and accurate retrieval of similar books.
- **Web Interface**: Provides a user-friendly React-based frontend for seamless interaction.
- **Scalable Deployment**: Backend deployed on Google Cloud and frontend hosted on GitHub Pages for reliable access.

## Architecture

1. **Data Processing**:
   - Collected and preprocessed a dataset of 45,000 book summaries and reviews.
   - Generated embeddings using OpenAI's models to capture semantic information.

2. **Similarity Search**:
   - Indexed embeddings with FAISS to enable quick similarity searches.
   - Designed the system to retrieve books similar to user preferences based on content.

3. **Backend**:
   - Developed a Flask API to handle recommendation requests and interact with the FAISS index.
   - Deployed the Flask application on Google Cloud for scalability.

4. **Frontend**:
   - Built a React application to provide an intuitive user interface.
   - Hosted the frontend on GitHub Pages for accessibility.

---

## Demo

### Browsing Available Books
Users can explore a selection of books available in the system. Each book card displays the **title, author, genre**, and includes a **"Like" button** to indicate preference.

![Browsing Books](https://raw.githubusercontent.com/Calculator5329/book-reccomendations-r/main/bookr-1.jpg)

---

### Viewing Book Details
Clicking on a book reveals a **detailed description**, allowing users to learn more before deciding to like it.

![Book Details](https://raw.githubusercontent.com/Calculator5329/book-reccomendations-r/main/bookr-2.jpg)

---

### Generating Personalized Recommendations
Once a user has liked books, they can click **"Calculate Recommendations"**, and the system will return a list of books similar to their preferences.

![Book Reccomendations](https://raw.githubusercontent.com/Calculator5329/book-reccomendations-r/main/bookr-3.jpg)

---

## Acknowledgements

- [OpenAI](https://openai.com/) for the embedding models.
- [FAISS](https://github.com/facebookresearch/faiss) by Facebook AI Research for efficient similarity search.
- [Create React App](https://create-react-app.dev/) for bootstrapping the React frontend.
- [Flask](https://flask.palletsprojects.com/) for the lightweight WSGI web application framework.
