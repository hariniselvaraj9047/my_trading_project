import React, { useEffect, useState } from "react";
import axios from "axios";
import { db, auth } from "./Firebase";  
import { doc, getDoc } from "firebase/firestore";
import { saveToWatchlist } from "./Watchlistservice"; 
import "./Newsfeed.css";


const API_KEY = "QL896HwnMDgalGAlFyVWiPwwUPaA8tfqY8e0-zsnfD6taQEw";

const DEFAULT_TRADING_TOPICS = ["stocks", "crypto", "forex", "commodities"]; 

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [userPreferences, setUserPreferences] = useState([]);

  
  const fetchNews = async (preferences) => {
    if (!preferences.length) return; 

    const query = preferences.join(" OR "); 
    const NEWS_URL = `https://api.currentsapi.services/v1/search?keywords=${query}&category=business&language=en&apiKey=${API_KEY}`;

    try {
      const response = await axios.get(NEWS_URL);
      if (response.data.news) {
        setArticles(response.data.news.slice(0, 20));
      } else {
        console.error("Unexpected API response:", response.data);
        setArticles([]);
      }
    } catch (error) {
      console.error(" Error fetching news:", error.response ? error.response.data : error.message);
    }
  };

  
  useEffect(() => {
    const fetchPreferences = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const prefs = docSnap.data().preferences || DEFAULT_TRADING_TOPICS; 
          setUserPreferences(prefs);
        }
      }
    };

    fetchPreferences();
  }, []);

  
  useEffect(() => {
    if (userPreferences.length) {
      fetchNews(userPreferences);
    }
  }, [userPreferences]);

  
  const handleReadMore = async (article) => {
    await saveToWatchlist(article);
    window.open(article.url, "_blank");
  };

  return (
    <div className="news-container">
      <h2>Trading News</h2>

    
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