import React, { useEffect, useState } from "react";
import axios from "axios";
import { db, auth } from "./Firebase"; // Import Firebase config
import { doc, getDoc } from "firebase/firestore";
import { saveToWatchlist } from "./Watchlistservice"; // Import saveToWatchlist function
import "./Newsfeed.css";

// Ensure environment variable is correctly loaded
const API_KEY = process.env.REACT_APP_MY_NEWSAPI_KEY;
if (!API_KEY) {
  console.error("🚨 ERROR: News API Key is missing! Ensure it's set in .env file.");
}

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("trading"); // Default category

  // Fetch user preferences from Firestore
  useEffect(() => {
    const fetchPreferences = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const prefs = docSnap.data().preferences || ["trading"];
            setSelectedCategory(prefs[0] || "trading");
          }
        } catch (error) {
          console.error("🚨 Error fetching user preferences:", error);
        }
      }
    };

    fetchPreferences();
  }, []);

  // Fetch news whenever category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchNews(selectedCategory);
    }
    const interval = setInterval(() => fetchNews(selectedCategory), 300000);
    return () => clearInterval(interval);
  }, [selectedCategory]);

  // Fetch News Data
  const fetchNews = async (category) => {
    try {
      const NEWS_URL =` https://newsapi.org/v2/everything?q=${category}&sortBy=publishedAt&apiKey=${API_KEY} `;
  
      const response = await axios.get(NEWS_URL, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
  
      if (response.data.articles) {
        setArticles(response.data.articles.slice(0, 20));
      } else {
        console.error("🚨 Unexpected API response:", response.data);
        setArticles([]);
      }
    } catch (error) {
      console.error("🚨 Error fetching news:", error.response ? error.response.data : error.message);
    }
  };

  // Handle Category Change
  const handleCategoryChange = (category) => {
    const mappedCategory = category.toLowerCase() === "all" ? "trading" : category.toLowerCase();
    setSelectedCategory(mappedCategory);
  };

  // Handle "Read More" Click
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
            onClick={() => handleCategoryChange(category)}
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
          <p>No news available. Please check your API key and category selection.</p>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;