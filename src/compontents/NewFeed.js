import React, { useEffect, useState } from "react";
import axios from "axios";
import { db, auth } from "./Firebase"; 
import { doc, getDoc } from "firebase/firestore";
import { saveToWatchlist } from "./Watchlistservice";
import "./Newsfeed.css";

const API_KEY = process.env.REACT_APP_MY_NEWSAPI;

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(["trading"]);

  const fetchNews = async (categories) => {
    if (categories.length === 0) return;
    const query = categories.join(" OR ");
    const NEWS_URL = `https://api.currentsapi.services/v1/search?keywords=${query}&language=en&apiKey=${API_KEY}`;

    try {
      const response = await axios.get(NEWS_URL);
      setArticles(response.data.news?.slice(0, 20) || []);
    } catch (error) {
      console.error("Error fetching news:", error.message);
      setArticles([]);
    }
  };

  useEffect(() => {
    const fetchPreferences = async () => {
      const user = auth.currentUser;
      if (user) {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          setSelectedCategories(docSnap.data().preferences || ["trading"]);
        }
      }
    };
    fetchPreferences();
  }, []);

  
  useEffect(() => {
    fetchNews(selectedCategories);
    const interval = setInterval(() => fetchNews(selectedCategories), 300000);
    return () => clearInterval(interval);
  }, [selectedCategories]);

  const handleReadMore = async (article) => {
    await saveToWatchlist(article);
    window.open(article.url, "_blank");
  };

  return (
    <div className="news-container">
      <h2>Latest Trading News</h2>
      <div className="news-list">
        {articles.length ? (
          articles.map((article, index) => (
            <div key={index} className="news-item">
              <h3>{article.title}</h3>
              {article.image && <img src={article.image} alt="News" width="200" />}
              <p>{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer" onClick={(e) => {
                e.preventDefault();
                handleReadMore(article);
              }}>
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