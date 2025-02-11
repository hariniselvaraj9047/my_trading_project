import React, { useEffect, useState } from "react";
import axios from "axios";
import { db, auth } from "./Firebase"; // Import Firebase config
import { doc, getDoc } from "firebase/firestore";
import { saveToWatchlist } from "./Watchlistservice"; // Import the saveToWatchlist function
import "./Newsfeed.css";

const NewsFeed = () => {
  const API_KEY = "c77b0f55e26b4d35856adee64101339b";
  const [articles, setArticles] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(["trading"]); // Default

  // Fetch news articles based on selected categories
  const fetchNews = async (categories) => {
    if (categories.length === 0) return;
    const queries = categories.map((cat) => `q=${cat}`).join("&");
    const NEWS_URL = `https://newsapi.org/v2/everything?${queries}&sortBy=publishedAt&apiKey=${API_KEY}`;

    try {
      const response = await axios.get(NEWS_URL);
      setArticles(response.data.articles.slice(0, 20));
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  // Fetch user preferences from Firestore
  useEffect(() => {
    const fetchPreferences = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const prefs = docSnap.data().preferences || ["trading"];
          setSelectedCategories(prefs);
        }
      }
    };

    fetchPreferences();
  }, []);

  // Fetch news when selectedCategories change
  useEffect(() => {
    fetchNews(selectedCategories);
    const interval = setInterval(() => fetchNews(selectedCategories), 300000);
    return () => clearInterval(interval);
  }, [selectedCategories]);

  // When clicking "Read More", automatically save the article to the watchlist
  const handleReadMore = async (article) => {
    await saveToWatchlist(article); // Save the article to the watchlist
    window.open(article.url, "_blank"); // Open the news article in a new tab
  };

  return (
    <div className="news-container">
      <h2>Latest Trading News</h2>

      {/* Category Selection */}
      <nav className="news-nav">
        {["All", "Stocks", "Crypto", "Forex", "Commodities"].map((category) => (
          <button
            key={category}
            className={selectedCategories.includes(category.toLowerCase()) ? "active" : ""}
            onClick={() => setSelectedCategories([category.toLowerCase()])}
          >
            {category}
          </button>
        ))}
      </nav>

      {/* News Articles */}
      <div className="news-list">
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <div key={index} className="news-item">
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  handleReadMore(article);
                }}
              >
                Read More
              </a>
            </div>
          ))
        ) : (
          <p>No news available.</p>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;