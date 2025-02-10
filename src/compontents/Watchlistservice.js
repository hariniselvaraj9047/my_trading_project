import { db, auth } from "./Firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
export const getWatchlist = async () => {
  if (!auth.currentUser) return [];

  try {
    const userId = auth.currentUser.uid;
    const watchlistRef = collection(db, "watchlist");

    // Query to get all news items saved by the logged-in user
    const q = query(watchlistRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const watchlistData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return watchlistData;
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return [];
  }
};
export const saveToWatchlist = async (article) => {
  if (!auth.currentUser) return;

  const userId = auth.currentUser.uid;
  const watchlistRef = collection(db, "watchlist");

  try {
    // Query to check if the article already exists in the user's watchlist
    const q = query(
      watchlistRef,
      where("userId", "==", userId),
      where("title", "==", article.title), // Check for existing title
      where("url", "==", article.url) // Ensure exact match with URL
    );

    const querySnapshot = await getDocs(q);

    // If article is already in the watchlist, don't add it again
    if (!querySnapshot.empty) {
      console.log("Article already exists in watchlist.");
      return;
    }

    // Add the article to the watchlist if it's not a duplicate
    await addDoc(watchlistRef, {
      userId,
      title: article.title,
      url: article.url,
      timestamp: new Date(),
    });

    console.log("Article added to watchlist.");
  } catch (error) {
    console.error("Error adding to watchlist:", error);
  }
};