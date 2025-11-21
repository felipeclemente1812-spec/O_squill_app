import Colors from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Header = () => {
  const { user, loading } = useAuth();

  const resetarTudo = async () => {
    try {
      await AsyncStorage.clear();
      console.log("✅ AsyncStorage limpo com sucesso!");
    } catch (e) {
      console.log("❌ Erro ao limpar AsyncStorage:", e);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Linha superior com botões laterais e título centralizado */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => {}} style={styles.sideButton}>
          <Text style={styles.btnText}>Transações</Text>
        </TouchableOpacity>

        {/* Centralizando título e boas-vindas */}
        <View style={styles.centerContainer}>
          <Text style={styles.title}>SQUILL</Text>
          <Text style={styles.welcomeText}>
            Bem-vindo{user ? `, ${user.nome}` : ""}
          </Text>
        </View>

        <TouchableOpacity
          onPress={resetarTudo}
          style={[styles.sideButton, styles.resetBtn]}
        >
          <Text style={[styles.btnText, { color: "#ff0000ff" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: Colors.brown,
    paddingTop: 4,
    paddingBottom: 2,
    paddingHorizontal: 15,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  centerContainer: {
    alignItems: "center", // centraliza SQUILL + Bem-vindo
  },
  title: {
    fontSize: 30,
    color: Colors.brown,
    letterSpacing: 2,
    fontWeight: "bold",
    textAlign: "center",
  },
  welcomeText: {
    color: "#444",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  sideButton: {
    borderColor: "#ccc",
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal:10,
    borderRadius: 12,
  },
  btnText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
  },
  resetBtn: {
    borderColor: "#ff6b6b",
  },
  loadingText: {
    color: Colors.text,
    textAlign: "center",
  },
});
