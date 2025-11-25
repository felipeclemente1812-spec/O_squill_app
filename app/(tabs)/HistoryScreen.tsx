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
          <View style={{ width: 20 }} />
          <Text style={styles.headerTitle}>SQUILL</Text>
          <View style={{ width: 20 }} />
        </View>

        <View style={styles.sectionTitleBox}>
          <Text style={styles.sectionTitle}>HISTÓRIA</Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Missão */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nossa Missão</Text>
            <Text style={styles.cardText}>
              Capacitar jovens com a educação financeira prática e interativa para construir um consumo consciente
            </Text>
          </View>

          {/* Valores */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nossos Valores</Text>
            <Text style={styles.cardText}>
              Oferecemos conhecimento, engajamento contínuo e decisões conscientes via gamificação e inovação
            </Text>
          </View>

          {/* Visão */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nossa Visão</Text>
            <Text style={styles.cardText}>
              Ser reconhecidos por prestar suporte e incentivar hábitos saudáveis, preparando para o futuro financeiro
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
    paddingTop: 20,
    paddingHorizontal: 16,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.brown,
  },

  sectionTitleBox: {
    backgroundColor: Colors.brown,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 14,
  },

  sectionTitle: {
    color: Colors.white,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#e6c6a8",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.brown,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.brown,
    textAlign: "center",
    marginBottom: 6,
  },

  cardText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: "center",
    lineHeight: 20,
  },
});
