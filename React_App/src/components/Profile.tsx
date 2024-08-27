import { useAuth0 } from "@auth0/auth0-react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  const saveUserData = async () => {
    if (isAuthenticated && user?.email) {
      const userRef = doc(db, "users", user.email);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, { teams: [], favorites: [] });
      }
    }
  };

  saveUserData();

  return (
    isAuthenticated && (
      <div>
        <img src={user?.picture} alt={user?.name} />
        <h2>{user?.name}</h2>
        <p>{user?.email}</p>
      </div>
    )
  );
};
