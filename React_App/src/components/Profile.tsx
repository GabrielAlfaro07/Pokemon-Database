import { useAuth0 } from "@auth0/auth0-react";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading ...</div>;
  }

  const saveUserData = async () => {
    if (isAuthenticated && user?.sub) {
      const userRef = doc(db, "users", user.sub); // Use user.sub instead of user.email
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // Create the user document
        await setDoc(userRef, {});

        // Create the "favorites" and "teams" subcollections
        const favoritesRef = collection(userRef, "favorites");
        const teamsRef = collection(userRef, "teams");

        // Optionally, initialize with empty documents or leave them empty
        await setDoc(doc(favoritesRef, "init"), {});
        await setDoc(doc(teamsRef, "init"), {});
      }
    }
  };

  saveUserData();

  return (
    isAuthenticated && (
      <div className="flex flex-col items-center p-4">
        <img
          src={user?.picture}
          alt={user?.name}
          className="w-24 h-24 rounded-full mb-4"
        />
        <h2 className="text-xl font-bold">{user?.name}</h2>
        <p className="text-gray-500">{user?.email}</p>
      </div>
    )
  );
};

export default Profile;
