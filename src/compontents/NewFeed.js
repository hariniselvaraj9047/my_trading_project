import React, { useEffect, useState } from "react";
import axios from "axios";
import { db, auth } from "./Firebase"; // Import Firebase config
import { doc, getDoc } from "firebase/firestore";
import { saveToWatchlist } from "./Watchlistservice"; // Import watchlist function
import "./Newsfeed.css";

const API_KEY ="QL896HwnMDgalGAlFyVWiPwwUPaA8tfqY8e0-zsnfD6taQEw" // Replace with your Currents API key

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(["trading"]); // Default category

  // Fetch news from Currents API
  const fetchNews = async (categories) => {
    if (categories.length === 0) return;
    const query = categories.join(" OR "); // Currents API supports OR-based keyword search
    const NEWS_URL = `https://api.currentsapi.services/v1/search?keywords=${query}&language=en&apiKey=${API_KEY}`;

    try {
      const response = await axios.get(NEWS_URL);
      if (response.data.news) {
        setArticles(response.data.news.slice(0, 20));
      } else {
        console.error("🚨 Unexpected API response:", response.data);
        setArticles([]);
      }
    } catch (error) {
      console.error("🚨 Error fetching news:", error.response ? error.response.data : error.message);
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

  // Handle "Read More" and save article to watchlist
  const handleReadMore = async (article) => {
    await saveToWatchlist(article);
    window.open(article.url, "_blank");
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
              {article.image && <img src={article.image} alt="News" width="200" />}
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
              <p><small>Published on: {new Date(article.published * 1000).toLocaleString()}</small></p>
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