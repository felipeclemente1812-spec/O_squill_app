import Colors from '@/constants/Colors';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = () => {
  // 🔹 Função para limpar todos os dados do AsyncStorage
  const resetarTudo = async () => {
    try {
      await AsyncStorage.clear();
      console.log("✅ AsyncStorage limpo com sucesso!");
    } catch (e) {
      console.log("❌ Erro ao limpar AsyncStorage:", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.userInfoWrapper}>
          <Image
            source={{ uri: "https://i.pravatar.cc/250?u=12" }}
            style={styles.userImag}
          />
          <View style={styles.userTxtWrapper}>
            <Text style={[styles.userText, { fontSize: 12 }]}>Hi, Jenny</Text>
            <Text style={[styles.userText, { fontSize: 16 }]}>
              Your <Text style={styles.boldText}>Budget</Text>
            </Text>
          </View>
        </View>

        {/* 🔹 Botões lado a lado */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity onPress={() => {}} style={styles.bntWrapper}>
            <Text style={styles.bntText}>My Transactions</Text>
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
    flex: 1,
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
  userImag: {
    height: 50,
    width: 50,
    borderRadius: 30,
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
