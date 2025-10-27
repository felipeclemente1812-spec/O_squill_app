import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import Colors from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = "@userData"; // salva email/senha
const LOGIN_KEY = "@isLoggedIn";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const handleRegister = async () => {
    if (!email || !password) return Alert.alert("Preencha email e senha");
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }));
    await AsyncStorage.setItem(LOGIN_KEY, "true");
    window.location.href = '/(tabs)/index'; // navega para app
  };

  const handleLogin = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return Alert.alert("Usuário não cadastrado");
    const { email: savedEmail, password: savedPassword } = JSON.parse(stored);
    if (email === savedEmail && password === savedPassword) {
      await AsyncStorage.setItem(LOGIN_KEY, "true");
      window.location.href = '/(tabs)/index';
    } else {
      Alert.alert("Email ou senha incorretos");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.title}>{mode === 'login' ? "Login" : "Registrar"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={mode === 'login' ? handleLogin : handleRegister}
      >
        <Text style={styles.buttonText}>{mode === 'login' ? "Entrar" : "Cadastrar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
        <Text style={styles.switchText}>
          {mode === 'login' ? "Ainda não tem conta? Cadastre-se" : "Já tem conta? Faça login"}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: Colors.white,
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#1c1c1c',
    color: Colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    backgroundColor: '#a82052',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  switchText: {
    color: '#aaa',
    marginTop: 15,
  },
});