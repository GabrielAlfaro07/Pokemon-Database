import { db } from "../../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

const USERS_COLLECTION = "users";
const FAVORITES_SUBCOLLECTION = "favorites";

export const getFavorites = async (userId: string) => {
  const favoritesCollectionRef = collection(
    db,
    USERS_COLLECTION,
    userId,
    FAVORITES_SUBCOLLECTION
  );

  const favoritesSnapshot = await getDocs(favoritesCollectionRef);
  const favoritePokemon = favoritesSnapshot.docs.map((doc) => doc.id);

  return favoritePokemon;
};

export const addFavorite = async (userId: string, pokemonId: string) => {
  const docRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    FAVORITES_SUBCOLLECTION,
    pokemonId
  );
  await setDoc(docRef, { pokemonId });
};

export const removeFavorite = async (userId: string, pokemonId: string) => {
  const docRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    FAVORITES_SUBCOLLECTION,
    pokemonId
  );
  await deleteDoc(docRef);
};
