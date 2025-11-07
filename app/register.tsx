import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [emailValido, setEmailValido] = useState<boolean | null>(null);
  const [senhaValida, setSenhaValida] = useState<boolean | null>(null);

  // ✅ Verifica se o e-mail tem formato válido
  const validarEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // ✅ Senha precisa de: 1 maiúscula, 1 minúscula, 1 número, 1 caractere especial e mínimo 8 caracteres
  const validarSenha = (senha: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(senha);

  const handleRegister = async () => {
    if (!nome || !email || !senha) return Alert.alert("Erro", "Preencha todos os campos!");
    if (!validarEmail(email)) return Alert.alert("Erro", "Digite um e-mail válido!");
    if (!validarSenha(senha))
      return Alert.alert(
        "Erro",
        "A senha precisa ter pelo menos 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial!"
      );

    await register(nome, email, senha);
    Alert.alert("Sucesso", "Conta criada!");
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar</Text>

      <TextInput
        placeholder="Nome"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="E-mail"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailValido(validarEmail(text));
        }}
      />
      {email.length > 0 && (
        <Text style={[styles.feedback, { color: emailValido ? "lightgreen" : "tomato" }]}>
          {emailValido ? "E-mail válido ✅" : "E-mail inválido ❌"}
        </Text>
      )}

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#aaa"
        style={styles.input}
        secureTextEntry
        value={senha}
        onChangeText={(text) => {
          setSenha(text);
          setSenhaValida(validarSenha(text));
        }}
      />
      {senha.length > 0 && (
        <Text style={[styles.feedback, { color: senhaValida ? "lightgreen" : "tomato" }]}>
          {senhaValida
            ? "Senha forte ✅"
            : "A senha deve conter 8+ caracteres, maiúscula, minúscula, número e símbolo ❌"}
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", backgroundColor: "#121212", padding: 20 },
  title: { color: "#fff", fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    backgroundColor: "#1c1c1e",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  feedback: {
    marginBottom: 10,
    fontSize: 14,
  },
  button: { backgroundColor: "#ff4b4b", padding: 14, borderRadius: 10, marginTop: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 18 },
  link: { color: "#fff", textAlign: "center", marginTop: 15, textDecorationLine: "underline" },
});
