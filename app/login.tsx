// app/login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);

    if (!email || !senha) return setError("Preencha todos os campos!");

    const ok = await login(email, senha);
    if (!ok) return setError("Credenciais inválidas ou usuário não encontrado!");

    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SQUILL</Text>
      <Text style={styles.subtitle}>
        Faça login e tenha acesso ao nosso aplicativo!
      </Text>

      <TextInput
        placeholder="E-mail"
        placeholderTextColor="#888"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#888"
        style={styles.input}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ENTRAR</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7b4b1d", // marrom escuro
    marginBottom: 6,
  },
  subtitle: {
    color: "#a36c35", // marrom mais claro
    fontSize: 13,
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#333",
  },
  error: {
    color: "#cc2e2e",
    textAlign: "center",
    marginBottom: 8,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#7b4b1d",
    borderRadius: 10,
    width: "100%",
    paddingVertical: 14,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "bold",
  },
  link: {
    color: "#7b4b1d",
    marginTop: 18,
    textDecorationLine: "underline",
    fontSize: 14,
  },
});
