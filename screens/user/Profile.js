import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { getUserInfo } from "../../services/userService";
import { getAuth } from "firebase/auth";
import { DangerButton, PrimaryButton } from "../../components/Buttons";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    marginVertical: 40,
  },
});

const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const auth = getAuth();
      const uid = auth.currentUser?.uid;

      if (!uid) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      try {
        const data = await getUserInfo(uid);
        data.email = auth.currentUser.email;
        setUserInfo(data);
      } catch (error) {
        Alert.alert("Erro", "Erro ao buscar informações do usuário.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert("Erro", "Erro ao realizar logout.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#C05621" />
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>User information not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seu Perfil</Text>
      <Text style={styles.label}>
        Telefone: {userInfo.phone || "Não informed"}
      </Text>
      <Text style={styles.label}>
        Email: {userInfo.email || "Not informed"}
      </Text>
      <Text style={styles.label}>Nome: {userInfo.name || "Not informed"}</Text>

      <PrimaryButton
        text={"Back to expenses"}
        action={() => navigation.navigate("Home")}
      />
      <DangerButton text={"Logout"} action={logout} />
    </View>
  );
};

export default ProfileScreen;
