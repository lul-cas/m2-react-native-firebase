import { Image, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  logo: {
    width: 30,
    height: 30,
    alignSelf: "center",
    resizeMode: "contain",
  },
});

export default function Logo() {
  return (
    <Image source={require("../assets/expenses.png")} style={styles.logo} />
  );
}
