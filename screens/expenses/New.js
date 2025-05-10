import { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { regexDate } from "../../utils/regex";
import { ErrorMessage, SuccessMessage } from "../../components/Messages";
import { PrimaryButton, SecondaryButton } from "../../components/Buttons";
import { formatCurrency } from "../../utils/format";
import { createExpense } from "../../services/expenseService";
import { relateExpenseToUser } from "../../services/userService";
import { getAuth } from "firebase/auth";

export default function NewExpenseScreen({ navigation }) {
  const [description, setDescription] = useState("");
  const [rawValue, setRawValue] = useState("");
  const [date, setDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const SetValue = (text) => {
    const onlyDigits = text.replace(/\D/g, "").slice(0, 11);
    setRawValue(onlyDigits);
  };

  const SetDate = (text) => {
    const onlyDigits = text.replace(/\D/g, "").slice(0, 8);
    let formatted = onlyDigits;
    if (onlyDigits.length > 4) {
      formatted = `${onlyDigits.slice(0, 2)}/${onlyDigits.slice(2, 4)}/${onlyDigits.slice(4, 8)}`;
    } else if (onlyDigits.length > 2) {
      formatted = `${onlyDigits.slice(0, 2)}/${onlyDigits.slice(2)}`;
    }
    setDate(formatted);
  };

  const parseDateFromString = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return new Date(`${year}-${month}-${day}T00:00:00`);
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const valueNumber = Number(rawValue) / 100;

    if (!description || !rawValue || !date) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (valueNumber <= 0) {
      setErrorMessage("Invalid value.");
      return;
    }

    if (!regexDate.test(date)) {
      setErrorMessage("Invalid date format. Use dd/mm/yyyy.");
      return;
    }

    setLoading(true);

    try {
      const expenseDate = parseDateFromString(date);

      const expense_id = await createExpense({
        description,
        value: valueNumber,
        date: expenseDate,
      });

      if (!expense_id) {
        setErrorMessage("Error while saving expense.");
        return;
      }

      const auth = getAuth();
      const uid = auth.currentUser?.uid;

      if (!uid) {
        setErrorMessage("User not authenticated.");
        return;
      }

      setSuccessMessage("Expense saved successfully!");
      await relateExpenseToUser(uid, expense_id);

      navigation.goBack();
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>New Expense</Text>

      <TextInput
        style={styles.input}
        placeholder="Expense Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Value (R$ 99,99)"
        value={formatCurrency(rawValue)}
        onChangeText={SetValue}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Date (dd/mm/yyyy)"
        value={date}
        onChangeText={SetDate}
        keyboardType="numeric"
      />

      {errorMessage ? <ErrorMessage text={errorMessage} /> : null}
      {successMessage ? <SuccessMessage text={successMessage} /> : null}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#C05621"
          style={{ marginVertical: 20 }}
        />
      ) : (
        <PrimaryButton text="Save" action={handleSubmit} />
      )}

      <SecondaryButton
        text="Cancel"
        action={() => navigation.goBack()}
        color="#FF0000"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
});
