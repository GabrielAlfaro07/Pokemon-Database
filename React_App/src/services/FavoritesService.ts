import { db } from "../../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

const FAVORITES_COLLECTION = "favorites";

export const getFavorites = async (userId: string) => {
  const docRef = doc(db, FAVORITES_COLLECTION, userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().pokemon || [];
  } else {
    return [];
  }
};

export const addFavorite = async (userId: string, pokemonId: string) => {
  const docRef = doc(db, FAVORITES_COLLECTION, userId);
  await setDoc(
    docRef,
    {
      pokemon: arrayUnion(pokemonId),
    },
    { merge: true }
  );
};

export const removeFavorite = async (userId: string, pokemonId: string) => {
  const docRef = doc(db, FAVORITES_COLLECTION, userId);
  await updateDoc(docRef, {
    pokemon: arrayRemove(pokemonId),
  });
};
