import React, { useState, useEffect } from "react";
import { db, auth } from "./Firebase"; // Import Firebase config
import { doc, setDoc, getDoc } from "firebase/firestore";

const Preferences = () => {
  const [selectedPrefs, setSelectedPrefs] = useState([]);

  useEffect(() => {
    const fetchPreferences = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSelectedPrefs(docSnap.data().preferences || []);
        }
      }
    };

    fetchPreferences();
  }, []);

  const allPreferences = ["All", "Stocks", "Crypto", "Forex", "Commodities"];

  const handleSelect = (pref) => {
    setSelectedPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "users", user.uid), { preferences: selectedPrefs });
      alert("Preferences saved!");
    }
  };

  return (
    <div>
      <h2>Select Your Preferences</h2>
      {allPreferences.map((pref) => (
        <div key={pref}>
          <input
            type="checkbox"
            checked={selectedPrefs.includes(pref)}
            onChange={() => handleSelect(pref)}
          />
          <label>{pref}</label>
        </div>
      ))}
      <button onClick={handleSave}>Save Preferences</button>
    </div>
  );
};

export default Preferences;