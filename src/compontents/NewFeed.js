import React, { useEffect, useState } from "react";
import axios from "axios";
import { db, auth } from "./Firebase"; // Import Firebase config
import { doc, getDoc } from "firebase/firestore";
import { saveToWatchlist } from "./Watchlistservice"; // Import saveToWatchlist function
import "./Newsfeed.css";

const API_KEY = process.env.REACT_APP_MY_NEWSAPI_KEY; // Replace with your NewsAPI key
const PROXY_URL = "https://cors-anywhere.herokuapp.com/"; // Free CORS Proxy

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("trading"); // Default category

  useEffect(() => {
    const fetchPreferences = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const prefs = docSnap.data().preferences || ["trading"];
          setSelectedCategory(prefs[0] || "trading");
          fetchNews(prefs[0] || "trading");
        } else {
          fetchNews("trading");
        }
      } else {
        fetchNews("trading");
      }
    };

    fetchPreferences();
    const interval = setInterval(() => fetchNews(selectedCategory), 300000);
    return () => clearInterval(interval);
  }, [selectedCategory]);

  const fetchNews = async (category) => {
    const NEWS_URL = `https://newsapi.org/v2/everything?q=${category}&sortBy=publishedAt&apiKey=${API_KEY}`;

    try {
      const response = await axios.get(PROXY_URL + NEWS_URL);
      setArticles(response.data.articles.slice(0, 20));
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchNews(category);
  };

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
            className={selectedCategory === category.toLowerCase() ? "active" : ""}
            onClick={() => handleCategoryChange(category.toLowerCase())}
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