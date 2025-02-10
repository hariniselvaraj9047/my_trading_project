import React, { useEffect, useState } from "react";
import { auth, db } from "./Firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { getWatchlist } from "./Watchlistservice"; // Import the getWatchlist function
import "./Profile.css";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [watchlist, setWatchlist] = useState([]);

  // Fetch User Data
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("No user data found");
        }
      } else {
        setUserDetails(null);
      }
    });
  };

  // Fetch Watchlist Data
  const fetchWatchlistData = async () => {
    const data = await getWatchlist();
    setWatchlist(data);
  };

  useEffect(() => {
    fetchUserData();
    fetchWatchlistData();
  }, []);

  // Handle Logout
  async function handleLogout() {
    try {
      await auth.signOut();
      setUserDetails(null);
      setWatchlist([]);
      window.location.href = "/login";
      toast.success("You have logged out successfully!", { position: "top-center" });
    } catch (error) {
      toast.error("Error logging out. Please try again.", { position: "bottom-center" });
    }
  }

  return (
    <div className="profile-container">
      {userDetails ? (
        <div className="profile-card">
          <div className="profile-info">
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>First Name:</strong> {userDetails.firstName}</p>
          </div>

          {/* Watchlist Section */}
          <h4>Your Watchlist</h4>
          <ul className="watchlist">
            {watchlist.length > 0 ? (
              watchlist.map((news) => (
                <li key={news.id} className="watchlist-item">
                  <a href={news.url} target="_blank" rel="noopener noreferrer">
                    {news.title}
                  </a>
                </li>
              ))
            ) : (
              <p className="empty-watchlist">No items in your watchlist</p>
            )}
          </ul>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <p className="loading">Loading...</p>
      )}
    </div>
  );
}

export default Profile;