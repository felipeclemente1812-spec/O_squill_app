import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null); // 🔴 Armazena o erro atual

  const handleLogin = async () => {
    setError(null); // limpa erro anterior

    if (!email || !senha) {
      setError("Preencha todos os campos!");
      return;
    }

    const storedData = await AsyncStorage.getItem("user");
    if (!storedData) {
      setError("Você não possui cadastro!");
      return;
    }

    const savedUser = JSON.parse(storedData);

    if (savedUser.email !== email) {
      setError("Você não possui cadastro!");
      return;
    }

    if (savedUser.senha !== senha) {
      setError("Senha incorreta!");
      return;
    }

    // Se tudo certo → faz login e redireciona
    const ok = await login(email, senha);
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      <TextInput
        placeholder="E-mail"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#aaa"
        style={styles.input}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {/* Mensagem de erro */}
      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("./register")}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", backgroundColor: "#121212", padding: 20 },
  title: { color: "#fff", fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { backgroundColor: "#1c1c1e", color: "#fff", padding: 12, borderRadius: 8, marginBottom: 12 },
  error: { color: "#ff4b4b", textAlign: "center", marginBottom: 10, fontSize: 15 },
  button: { backgroundColor: "#ff4b4b", padding: 14, borderRadius: 10, marginTop: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 18 },
  link: { color: "#fff", textAlign: "center", marginTop: 15, textDecorationLine: "underline" },
});
