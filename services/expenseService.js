import { db } from "../firebase";
import {
  collection,
  doc,
  updateDoc,
  addDoc,
  getDocs,
} from "firebase/firestore";

export const createExpense = async ({ description, value, date }) => {
  try {
    const docRef = await addDoc(collection(db, "expenses"), {
      description,
      value,
      date: new Date(date),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error while saving expense:", error);
    throw error;
  }
};

export const listExpenses = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "expenses"));
    console.log("Expenses fetched:", querySnapshot.docs.length);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error while listing expenses:", error);
    throw error;
  }
};

export const updateExpense = async (id, { description, value, date }) => {
  try {
    const expenseRef = doc(db, "expenses", id);
    await updateDoc(expenseRef, {
      description,
      value,
      date: new Date(date),
    });
  } catch (error) {
    console.error("Error while updating expense:", error);
    throw error;
  }
};

export const deleteExpense = async (id) => {
  try {
    const expenseRef = doc(db, "expenses", id);
    await updateDoc(expenseRef, {
      isDeleted: true,
    });
  } catch (error) {
    console.error("Error while deleting expense:", error);
    throw error;
  }
};
