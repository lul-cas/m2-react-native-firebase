import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

export const createOrUpdateUser = async (uid, phone) => {
  try {
    await setDoc(
      doc(db, "users", uid),
      {
        phone,
        expenses: [],
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Error while updating user info: ", error);
    throw error;
  }
};

export const relateExpenseToUser = async (uid, expenseId) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      expenses: arrayUnion(expenseId),
    });
  } catch (error) {
    console.error("Error while trying to relate expense to user: ", error);
    throw error;
  }
};

export const getUserInfo = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Error while fetching user info: ", error);
    throw error;
  }
};
