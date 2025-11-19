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
      {/* 🔹 Linha superior com título e botões nos cantos */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => {}} style={styles.sideButton}>
          <Text style={styles.btnText}>Transações</Text>
        </TouchableOpacity>

        <Text style={styles.title}>SQUILL</Text>

        <TouchableOpacity
          onPress={resetarTudo}
          style={[styles.sideButton, styles.resetBtn]}
        >
          <Text style={[styles.btnText, { color: "#ff6b6b" }]}>Resetar</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Texto de boas-vindas alinhado à esquerda */}
      <Text style={styles.welcomeText}>
        Bem-vindo{user ? `, ${user.nome}` : ""}
      </Text>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: Colors.brown,
    paddingTop: 5, // Reduzido de 10 para 5
    paddingBottom: 4, // Reduzido de 8 para 4
    paddingHorizontal: 15,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 40,
    color: Colors.brown,
    letterSpacing: 2,
    textAlign: "center",
    alignItems: "center",
    fontWeight: "bold",
  },

  welcomeText: {
    color: "#444",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2, // Reduzido de 4 para 2
    textAlign: "center",
  },
  sideButton: {
    borderColor: "#ccc",
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  btnText: {
    color: "#333",
    fontSize: 12,
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
