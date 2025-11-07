import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const Header = () => {
  const { user, logout, loading } = useAuth();

  // 🔹 Função para limpar todos os dados do AsyncStorage (botão Resetar)
  const resetarTudo = async () => {
    try {
      await AsyncStorage.clear();
      console.log("✅ AsyncStorage limpo com sucesso!");
    } catch (e) {
      console.log("❌ Erro ao limpar AsyncStorage:", e);
    }
  };

  // 🔹 Enquanto carrega, mostra algo neutro
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: Colors.white, textAlign: 'center' }}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        {/* 🔹 Informações do usuário */}
        <View style={styles.userInfoWrapper}>
          <Image
            source={require('@/assets/icons/semft.jpg')}
            style={{ width: 50, height: 50, borderRadius: 1000 }}
          />

          <View style={styles.userTxtWrapper}>
            <Text style={[styles.userText, { fontSize: 12 }]}>Bem-vindo</Text>
            <Text style={[styles.userText, { fontSize: 16 }]}>
              {user ? user.nome : 'Usuário'}
            </Text>
          </View>
        </View>

        {/* 🔹 Botões lado a lado */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity onPress={() => {}} style={styles.bntWrapper}>
            <Text style={styles.bntText}>Minhas Transações</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={resetarTudo} style={[styles.bntWrapper, styles.resetBtn]}>
            <Text style={[styles.bntText, { color: "#ff6b6b" }]}>Resetar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.black,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: "space-between",
    height: 70,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  userInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    color: Colors.white,
  },
  userTxtWrapper: {
    marginLeft: 10,
  },
  boldText: {
    fontWeight: '700',
  },
  bntWrapper: {
    borderColor: '#666',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  bntText: {
    color: Colors.white,
    fontSize: 12,
  },
  resetBtn: {
    borderColor: '#ff6b6b',
  },
});
