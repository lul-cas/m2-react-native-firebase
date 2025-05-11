import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, signInWithEmailAndPassword } from "../../firebase";
import { PrimaryButton, SecondaryButton } from "../../components/Buttons";
import { EmailInput, PasswordInput } from "../../components/CustomInputs";
import { regexEmail, regexPassword } from "../../utils/regex";

const styles = StyleSheet.create({
  container: {
    margin: 25,
  },
  title: {
    fontSize: 45,
    textAlign: "center",
    marginVertical: 40,
  },
  errorMessage: {
    fontSize: 18,
    textAlign: "center",
    color: "red",
  },
});

export default function LoginScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const login = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    if (!regexEmail.test(email)) {
      setErrorMessage("Oh-no, invalid email address!");
      return;
    }

    if (!regexPassword.test(password)) {
      setErrorMessage(
        "The password must contain at least 8 characters, an uppercase letter, a lowercase letter, a number, and a symbol. Please try again!",
      );
      return;
    }

    setErrorMessage("");

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log(user);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  useEffect(() => {
    setErrorMessage("");
  }, [email, password]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <EmailInput value={email} setValue={setEmail} />

        <PasswordInput value={password} setValue={setPassword} />

        <TouchableOpacity
          onPress={() => {
            navigation.push("ForgotPassword");
          }}
        >
          <Text>Forgot my password</Text>
        </TouchableOpacity>
        {errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
        <PrimaryButton
          text={"Login"}
          action={() => {
            login();
          }}
        />

        <Text>Don't have a account?</Text>

        <SecondaryButton
          text={"Sign-up"}
          action={() => {
            navigation.push("Register");
          }}
        />
      </View>
    </SafeAreaView>
  );
}
