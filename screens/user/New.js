import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { createOrUpdateUser } from "../../services/userService";
import { getAuth } from "firebase/auth";
import { PrimaryButton } from "../../components/Buttons";
import { regexPhone } from "../../utils/regex";
import { ErrorMessage, SuccessMessage } from "../../components/Messages";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "start",
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    margin: 40,
  },
});

const NewUserInfoScreen = () => {
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  const salvarUsuario = async () => {
    setSuccessMessage("");
    if (!uid) {
      setErrorMessage("User not authenticated.");
      return;
    }

    if (!regexPhone.test(phone)) {
      setErrorMessage("Invalid phone number format.");
      return;
    }

    try {
      await createOrUpdateUser(uid, phone);
      setErrorMessage("");
      Alert.alert("Success", "User information saved successfully.");
    } catch (error) {
      setErrorMessage("An error occurred while saving user information.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lets finish your register</Text>
      <Text style={styles.label}>Telefone:</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        placeholder="(99) 99999-9999"
      />
      {errorMessage ? <ErrorMessage text={errorMessage} /> : null}

      {successMessage ? <SuccessMessage text={successMessage} /> : null}

      <PrimaryButton text={"Save"} action={salvarUsuario} />
    </View>
  );
};

export default NewUserInfoScreen;
