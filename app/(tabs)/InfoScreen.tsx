import { Stack } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/Colors";
import textosData from "@/assets/texts.json";
import { TextosJSON, Topico } from "@/types";

const textos: TextosJSON = textosData;

const InfoScreen = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={{ width: 20 }} />
          <Text style={styles.headerTitle}>SQUILL</Text>
          <View style={{ width: 20 }} />
        </View>

        {/* Título da seção */}
        <View style={styles.sectionTitleBox}>
          <Text style={styles.sectionTitle}>INFORMAÇÕES</Text>
        </View>

        {/* Conteúdo */}
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
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
    paddingTop: 20,      // antes: 55
    paddingHorizontal: 16, // reduzido
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,   // antes: 10
  },

  headerTitle: {
    fontSize: 26,    // antes: 34
    fontWeight: "bold",
    color: Colors.brown,
  },

  sectionTitleBox: {
    backgroundColor: Colors.brown,
    paddingVertical: 8, // antes: 12
    borderRadius: 8,
    marginBottom: 14, // antes: 22
  },

  sectionTitle: {
    color: Colors.white,
    textAlign: "center",
    fontSize: 20,   // antes: 24
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#e6c6a8",
    padding: 14,     // antes: 20
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.brown,
  },

  cardTitle: {
    fontSize: 18,    // antes: 20
    fontWeight: "bold",
    color: Colors.brown,
    textAlign: "center",
    marginBottom: 6, // antes: 8
  },

  subCardTitle: {
    fontSize: 16,   // antes: 18
    fontWeight: "600",
    color: Colors.brown,
    textAlign: "center",
  },

  cardText: {
    fontSize: 14,   // antes: 16
    color: Colors.text,
    textAlign: "center",
    lineHeight: 20, // antes: 22
  },
});
