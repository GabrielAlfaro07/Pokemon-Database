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
const TEAMS_SUBCOLLECTION = "teams";

// Fetch all teams for a user
export const getTeams = async (userId: string) => {
  try {
    const teamsCollectionRef = collection(
      db,
      USERS_COLLECTION,
      userId,
      TEAMS_SUBCOLLECTION
    );
    const teamsSnapshot = await getDocs(teamsCollectionRef);
    const teams = teamsSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((team) => team.id !== "init"); // Filter out the "init" team
    return teams;
  } catch (error) {
    console.error("Error fetching teams: ", error);
    throw new Error("Failed to fetch teams.");
  }
};

// Create a new team
export const createTeam = async (userId: string, teamId: string) => {
  try {
    const teamRef = doc(
      db,
      USERS_COLLECTION,
      userId,
      TEAMS_SUBCOLLECTION,
      teamId
    );
    await setDoc(teamRef, {});
  } catch (error) {
    console.error("Error creating team: ", error);
    throw new Error("Failed to create team.");
  }
};

// Delete a team
export const deleteTeam = async (userId: string, teamId: string) => {
  try {
    const teamRef = doc(
      db,
      USERS_COLLECTION,
      userId,
      TEAMS_SUBCOLLECTION,
      teamId
    );
    await deleteDoc(teamRef);
  } catch (error) {
    console.error("Error deleting team: ", error);
    throw new Error("Failed to delete team.");
  }
};

// Add a Pokémon to a team
export const addPokemonToTeam = async (
  userId: string,
  teamId: string,
  pokemonId: string
) => {
  try {
    const pokemonRef = doc(
      db,
      USERS_COLLECTION,
      userId,
      TEAMS_SUBCOLLECTION,
      teamId,
      "pokemon",
      pokemonId
    );
    await setDoc(pokemonRef, { pokemonId });
  } catch (error) {
    console.error("Error adding Pokémon to team: ", error);
    throw new Error("Failed to add Pokémon to team.");
  }
};

// Remove a Pokémon from a team
export const removePokemonFromTeam = async (
  userId: string,
  teamId: string,
  pokemonId: string
) => {
  try {
    const pokemonRef = doc(
      db,
      USERS_COLLECTION,
      userId,
      TEAMS_SUBCOLLECTION,
      teamId,
      "pokemon",
      pokemonId
    );
    await deleteDoc(pokemonRef);
  } catch (error) {
    console.error("Error removing Pokémon from team: ", error);
    throw new Error("Failed to remove Pokémon from team.");
  }
};
