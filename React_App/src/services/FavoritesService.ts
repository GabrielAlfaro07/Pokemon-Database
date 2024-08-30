import { db } from "../../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

const USERS_COLLECTION = "users";
const FAVORITES_SUBCOLLECTION = "favorites";

export const getFavorites = async (userId: string) => {
  try {
    console.log("Fetching favorites for user:", userId);
    const favoritesCollectionRef = collection(
      db,
      USERS_COLLECTION,
      userId,
      FAVORITES_SUBCOLLECTION
    );

    const favoritesSnapshot = await getDocs(favoritesCollectionRef);
    const favoritePokemon = favoritesSnapshot.docs.map((doc) => doc.id);
    console.log("Fetched favorites:", favoritePokemon);
    return favoritePokemon;
  } catch (error) {
    console.error("Error fetching favorites: ", error);
    throw new Error("Failed to fetch favorite Pokémon.");
  }
};

export const addFavorite = async (userId: string, pokemonId: string) => {
  try {
    const docRef = doc(
      db,
      USERS_COLLECTION,
      userId,
      FAVORITES_SUBCOLLECTION,
      pokemonId
    );
    await setDoc(docRef, { pokemonId });
  } catch (error) {
    console.error("Error adding favorite: ", error);
    throw new Error("Failed to add favorite Pokémon.");
  }
};

export const removeFavorite = async (userId: string, pokemonId: string) => {
  try {
    const docRef = doc(
      db,
      USERS_COLLECTION,
      userId,
      FAVORITES_SUBCOLLECTION,
      pokemonId
    );
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error removing favorite: ", error);
    throw new Error("Failed to remove favorite Pokémon.");
  }
};
