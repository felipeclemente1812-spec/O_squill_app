import { Stack } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/Colors";
import textosData from "@/assets/texts.json"; // JSON com todos os artigos
import { TextosJSON, Topico } from "@/types";

const textos: TextosJSON = textosData;

const InfoScreen = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        {/* Top Bar */}
        <View style={styles.headerRow}>
          <View style={{ width: 26 }} />
          <Text style={styles.headerTitle}>SQUILL</Text>
          <View style={{ width: 26 }} />
        </View>

        {/* Título da seção */}
        <View style={styles.sectionTitleBox}>
          <Text style={styles.sectionTitle}>INFORMAÇÕES</Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {textos &&
            Object.keys(textos).map((key: string) => {
              const artigo = textos[key];
              return (
                <View key={key} style={styles.card}>
                  <Text style={styles.cardTitle}>{artigo.titulo}</Text>
                  <Text style={styles.cardText}>{artigo.descricao}</Text>

                  {artigo.topicos?.map((topico: Topico, index: number) => (
                    <View key={index} style={{ marginTop: 10 }}>
                      <Text style={styles.subCardTitle}>
                        {topico.subtitulo}
                      </Text>
                      <Text style={styles.cardText}>{topico.conteudo}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
        </ScrollView>
      </View>
    </>
  );
};

export default InfoScreen;

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
    fontSize: 34,
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
    fontSize: 24,
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
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.brown,
    textAlign: "center",
    marginBottom: 8,
  },

  subCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.brown,
    textAlign: "center",
  },

  cardText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",
    lineHeight: 22,
  },
});
