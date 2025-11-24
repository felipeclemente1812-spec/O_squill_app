import Colors from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useSquill } from "@/context/SquillContext";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const buttonSize = width * 0.12;

const Header = () => {
  const { user, loading, logout } = useAuth();
  const { squillImage } = useSquill();
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  // 🔥 FRASES DO MASCOTE
  const phrases = [
    "Vamos economizar hoje?",
    "Eu acredito em você 💸",
    "Registre seus gastos!",
    "Controle é poder!",
    "Meta: gastar menos hoje!",
  ];

  const [phraseIndex, setPhraseIndex] = React.useState(0);
  const [showBubble, setShowBubble] = React.useState(true);

  // 🔥 Troca a frase automaticamente a cada 1 minuto
  React.useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
      setShowBubble(true);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  const confirmLogout = async () => {
    await logout();
    setShowLogoutModal(false);
    router.replace("/login");
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.topRow}>
          {/* 🔥 BALÃO DE FALA */}
          {showBubble && (
            <View style={styles.bubbleContainer}>
              <Text style={styles.bubbleText}>{phrases[phraseIndex]}</Text>
            </View>
          )}

          {/* 🔥 MASCOTE */}
          <TouchableOpacity
            onPress={() => {
              setPhraseIndex((prev) => (prev + 1) % phrases.length);
              setShowBubble(true);
            }}
            style={styles.mascotButton}
          >
            <Image
              source={squillImage}
              style={styles.mascotImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* TÍTULO */}
          <View style={styles.centerContainer}>
            <TouchableOpacity
              onPress={async () => {
                await AsyncStorage.clear();
                alert("Todos os dados foram apagados!");
              }}
            >
              <Text style={styles.title}>SQUILL</Text>
            </TouchableOpacity>

            <Text style={styles.welcomeText}>
              Bem-vindo{user ? `, ${user.nome}` : ""}
            </Text>
          </View>

          {/* Logout */}
          <TouchableOpacity
            onPress={() => setShowLogoutModal(true)}
            style={[styles.sideButton, styles.resetBtn]}
          >
            <Text style={[styles.btnText, { color: "#ff0000ff" }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* MODAL */}
      <Modal
        transparent
        visible={showLogoutModal}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tem certeza que deseja sair?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.confirmBtn]}
                onPress={confirmLogout}
              >
                <Text style={styles.confirmText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: Colors.brown,
    paddingTop: 4,
    paddingBottom: 2,
    paddingHorizontal: 15,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },

  bubbleContainer: {
    position: "absolute",
    left: 40, // 👉 movido mais pra direita
    top: -10, // 👉 levemente acima para liberar o chapéu
    maxWidth: width * 0.45,
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.brown,
    zIndex: 10,
  },

  bubbleText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.brown,
  },

  mascotButton: {
    height: buttonSize,
    width: buttonSize,
    borderRadius: buttonSize * 0.4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  mascotImage: {
    height: 64,
    width: 64,
  },

  centerContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    color: Colors.brown,
    letterSpacing: 2,
    fontWeight: "bold",
    textAlign: "center",
  },
  welcomeText: {
    color: "#444",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },

  sideButton: {
    borderColor: "#ccc",
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  resetBtn: {
    borderColor: "#ff6b6b",
  },
  btnText: {
    fontSize: 14,
    fontWeight: "600",
  },

  loadingText: {
    color: Colors.text,
    textAlign: "center",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    backgroundColor: "rgba(0,0,0,0.7)",
    width: "90%",
    borderRadius: 15,
    padding: 20,
    borderWidth: 3,
    borderColor: Colors.brown,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 2,
  },
  cancelBtn: {
    borderColor: "#aaa",
  },
  confirmBtn: {
    borderColor: "#ff6b6b",
  },
  cancelText: {
    color: "#ddd",
    textAlign: "center",
    fontSize: 16,
  },
  confirmText: {
    color: "#ff6b6b",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
