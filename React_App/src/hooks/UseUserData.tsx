import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export const useUserData = () => {
  const { user, isAuthenticated } = useAuth0();
  const [isUserDataInitialized, setIsUserDataInitialized] = useState(false);

  useEffect(() => {
    console.log("useUserData: Checking if user data needs to be saved"); // Debugging line
    const saveUserData = async () => {
      if (isAuthenticated && user?.sub) {
        console.log("useUserData: User authenticated, saving data"); // Debugging line
        const userRef = doc(db, "users", user.sub);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          console.log("useUserData: Creating user document in Firestore"); // Debugging line
          await setDoc(userRef, {});

          const favoritesRef = collection(userRef, "favorites");
          const teamsRef = collection(userRef, "teams");

          await setDoc(doc(favoritesRef, "init"), {});
          await setDoc(doc(teamsRef, "init"), {});
        }

        setIsUserDataInitialized(true); // Indicate that user data is initialized
      }
    };

    saveUserData();
  }, [isAuthenticated, user]);

  return isUserDataInitialized;
};
