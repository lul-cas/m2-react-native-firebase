import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { auth, db } from "../firebase";
import { useState, useEffect, useCallback } from "react";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { listExpenses, deleteExpense } from "../services/expenseService";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Logo from "../components/Logo";
import { PrimaryButton } from "../components/Buttons";
import { getUserInfo } from "../services/userService";
import ExpenseCard from "../components/ExpenseCard";
import { formatCurrency } from "../utils/format";

const styles = StyleSheet.create({
  titleLogoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 30,
    marginLeft: 10,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  safeArea: {
    flex: 1,
    padding: 20,
    position: "relative",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileButton: {
    backgroundColor: "#C05621",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  profileButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0.0);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          navigation.navigate("NewUserInfo");
        }
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchExpenses = async () => {
        if (!user) return;

        setLoading(true);
        try {
          const userInfo = await getUserInfo(user.uid);
          const expenses = await listExpenses();
          const userExpenses = expenses.filter(
            (expense) =>
              userInfo.expenses.includes(expense.id) && !expense.isDeleted,
          );

          let total = 0;
          userExpenses.forEach((e) => (total += e.value));

          userExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

          const groupedExpenses = userExpenses.reduce((acc, expense) => {
            let date = expense.date.toDate().toLocaleDateString("pt-BR");
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(expense);
            return acc;
          }, {});

          setTotalExpenses(total);
          setList(Object.entries(groupedExpenses));
        } catch (error) {
          console.error("Error fetching expenses:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchExpenses();
    }, [user]),
  );

  const handleDelete = async (id) => {
    await deleteExpense(id);
    setList((prevList) =>
      prevList
        .map(([date, expenses]) => [date, expenses.filter((e) => e.id !== id)])
        .filter(([_, expenses]) => expenses.length > 0),
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C05621" />
          <Text>Loading expenses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.titleLogoContainer}>
          <Text style={styles.title}>Expenses Hub</Text>
          <Logo />
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Hello, {user?.email}!
      </Text>

      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        Your expenses: Total {formatCurrency(totalExpenses, false)}
      </Text>

      <ScrollView style={styles.scrollContainer}>
        {list.map(([date, expenses]) => (
          <View key={date} style={{ marginBottom: 20 }}>
            <Text
              style={{ fontSize: 20, marginBottom: 10, fontWeight: "bold" }}
            >
              {date}
            </Text>
            {expenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onEdit={() => navigation.navigate("EditExpense", { expense })}
                onDelete={() => handleDelete(expense.id)}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      <PrimaryButton
        text={"Add Expense"}
        style={{ marginBottom: 20 }}
        action={() => navigation.navigate("NewExpense")}
      />
    </SafeAreaView>
  );
}
