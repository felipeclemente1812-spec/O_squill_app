import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
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

  const validarEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validarSenha = (senha: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(senha);

  const handleRegister = async () => {
    if (!nome || !email || !senha)
      return Alert.alert("Erro", "Preencha todos os campos!");
    if (!validarEmail(email))
      return Alert.alert("Erro", "Digite um e-mail válido!");
    if (!validarSenha(senha))
      return Alert.alert(
        "Erro",
        "A senha deve ter 8+ caracteres, incluindo letra maiúscula, minúscula, número e símbolo."
      );

    await register(nome, email, senha);
    Alert.alert("Sucesso", "Conta criada com sucesso!");
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f2f2f2" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.logo}>SQUILL</Text>
          <Text style={styles.subtitle}>
            Preencha as informações e tenha acesso ao nosso aplicativo!
          </Text>

          <TextInput
            placeholder="Nome Completo"
            placeholderTextColor="#888"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            placeholder="E-mail"
            placeholderTextColor="#888"
            style={styles.input}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailValido(validarEmail(text));
            }}
            autoCapitalize="none"
          />

          {email.length > 0 && (
            <Text
              style={[
                styles.feedback,
                { color: emailValido ? "#1f8a1f" : "#cc2e2e" },
              ]}
            >
              {emailValido ? "E-mail válido ✅" : "E-mail inválido ❌"}
            </Text>
          )}

          <TextInput
            placeholder="Senha"
            placeholderTextColor="#888"
            style={styles.input}
            secureTextEntry
            value={senha}
            onChangeText={(text) => {
              setSenha(text);
              setSenhaValida(validarSenha(text));
            }}
          />

          {senha.length > 0 && (
            <Text
              style={[
                styles.feedback,
                { color: senhaValida ? "#1f8a1f" : "#cc2e2e" },
              ]}
            >
              {senhaValida
                ? "Senha forte ✅"
                : "Senha deve conter 8+ caracteres, maiúscula, minúscula, número e símbolo ❌"}
            </Text>
          )}

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>CRIAR CONTA</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.link}>Já tem conta? Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  container: {
    alignItems: "center",
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7b4b1d",
    marginBottom: 6,
  },
  subtitle: {
    color: "#a36c35",
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
  feedback: {
    alignSelf: "flex-start",
    marginBottom: 10,
    fontSize: 13,
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
