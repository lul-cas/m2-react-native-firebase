import { TouchableOpacity, Text, StyleSheet } from "react-native";

export function PrimaryButton({ action, text }) {
  return (
    <TouchableOpacity
      onPress={action}
      style={[styles.button, styles.primaryButton]}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

export function SecondaryButton({ action, text }) {
  return (
    <TouchableOpacity
      onPress={action}
      style={[styles.button, styles.secondaryButton]}
    >
      <Text style={[styles.buttonText, styles.secondaryButtonText]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export function DangerButton({ action, text }) {
  return (
    <TouchableOpacity
      onPress={action}
      style={[styles.button, styles.dangerButton]}
    >
      <Text style={[styles.buttonText]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 15,
    marginVertical: 15,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
  },
  primaryButton: {
    backgroundColor: "#C05621",
  },
  secondaryButton: {
    borderColor: "#C05621",
    borderWidth: 2,
  },
  secondaryButtonText: {
    color: "#C05621",
  },
  dangerButton: {
    backgroundColor: "red",
  },
});
