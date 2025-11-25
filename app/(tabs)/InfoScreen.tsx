import { Stack } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from "react-native";
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

        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          {/* Seções de Informações */}
          {textos &&
            Object.keys(textos).map((key: string) => {
              const artigo = textos[key];

              return (
                <View key={key} style={{ marginBottom: 16 }}>
                  {/* Título da Seção */}
                  <View style={styles.sectionTitleBox}>
                    <Text style={styles.sectionTitle}>{artigo.titulo.toUpperCase()}</Text>
                  </View>

                  {/* Conteúdo / Passos */}
                  <View style={styles.card}>
                    {artigo.topicos?.map((topico: Topico, index: number) => (
                      <View key={index} style={styles.passoContainer}>
                        <View style={styles.numeroContainer}>
                          <Text style={styles.numeroPasso}>{index + 1}</Text>
                        </View>
                        <View style={styles.textoPassoContainer}>
                          <Text style={styles.passoTitulo}>{topico.subtitulo}</Text>
                          <Text style={styles.passoConteudo}>{topico.conteudo}</Text>
                        </View>
                      </View>
                    ))}

                    {/* Para textos que não possuem tópicos */}
                    {!artigo.topicos && (
                      <Text style={styles.passoConteudo}>{artigo.descricao}</Text>
                    )}

                    {/* Link da seção de Recomendações */}
                    {key === "recomendacoes" && (
                      <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() =>
                          Linking.openURL("https://wordwall.net/pt-br/community/educa%C3%A7%C3%A3o-financeira ")
                        }
                      >
                        <Text style={styles.linkButtonText}>Acessar Wordwall</Text>
                      </TouchableOpacity>
                    )}
                  </View>
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
    marginBottom: 12,
  },

  sectionTitle: {
    color: Colors.white,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#e6c6a8",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.brown,
  },

  passoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  numeroContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.brown,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  numeroPasso: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },

  textoPassoContainer: {
    flex: 1,
  },

  passoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.brown,
    marginBottom: 2,
  },

  passoConteudo: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },

  linkButton: {
    backgroundColor: Colors.brown,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 10,
  },

  linkButtonText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
});
