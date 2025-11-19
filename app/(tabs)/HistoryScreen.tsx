import { Stack } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/Colors";

const HistoryScreen = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        {/* Top Bar */}
        <View style={styles.headerRow}>
          {/* ÍCONE REMOVIDO */}
          <View style={{ width: 26 }} />
          <Text style={styles.headerTitle}>SQUILL</Text>
          <View style={{ width: 26 }} />
        </View>

        <View style={styles.sectionTitleBox}>
          <Text style={styles.sectionTitle}>HISTÓRIA</Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Missão */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nossa Missão</Text>
            <Text style={styles.cardText}>
              Capacitar jovens, por meio de conteúdos educativos, a desenvolver
              educação financeira de forma prática, acessível e interativa,
              promovendo planejamento, autonomia e consumo consciente.
            </Text>
          </View>

          {/* Valores */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nossos Valores</Text>
            <Text style={styles.cardText}>
              Capacitar jovens, por meio de conteúdos educativos, a desenvolver
              educação financeira de forma prática, acessível e interativa,
              promovendo planejamento, autonomia e consumo consciente.
            </Text>
          </View>

          {/* Visão */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nossa Visão</Text>
            <Text style={styles.cardText}>
              Capacitar jovens, por meio de conteúdos educativos, a desenvolver
              educação financeira de forma prática, acessível e interativa,
              promovendo planejamento, autonomia e consumo consciente.
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 55,
    paddingHorizontal: 20,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 34, // AUMENTADO
    fontWeight: "bold",
    color: Colors.brown,
  },

  sectionTitleBox: {
    backgroundColor: Colors.brown,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 22,
  },

  sectionTitle: {
    color: Colors.white,
    textAlign: "center",
    fontSize: 24, // AUMENTADO
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#e6c6a8",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.brown,
  },

  cardTitle: {
    fontSize: 20, // AUMENTADO
    fontWeight: "bold",
    color: Colors.brown,
    textAlign: "center",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 16, // AUMENTADO
    color: Colors.text,
    textAlign: "center",
    lineHeight: 22,
  },
});