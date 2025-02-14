import { db, auth } from "./Firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
export const getWatchlist = async () => {
  if (!auth.currentUser) return [];

  try {
    const userId = auth.currentUser.uid;
    const watchlistRef = collection(db, "watchlist");

    
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
     
    const q = query(
      watchlistRef,
      where("userId", "==", userId),
      where("title", "==", article.title),  
      where("url", "==", article.url) 
    );

    const querySnapshot = await getDocs(q);

     
    if (!querySnapshot.empty) {
      console.log("Article already exists in watchlist.");
      return;
    }

     
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