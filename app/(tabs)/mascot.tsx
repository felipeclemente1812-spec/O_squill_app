import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { Acessory } from "@/components/Acessorio";
import { useState } from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSquill } from "@/context/SquillContext";

const baseImages: Record<string, ImageSourcePropType> = {
  base: require("@/assets/acessorios/base.png"),
  hat: require("@/assets/acessorios/baseHat.png"),
  parrot: require("@/assets/acessorios/baseParrot.png"),
  bone: require("@/assets/acessorios/baseBone.png"),
  aqua: require("@/assets/acessorios/baseAqua.png"),
  tapaOlho: require("@/assets/acessorios/baseTapaOlho.png"),
  purpleHat: require("@/assets/acessorios/basePurpleHat.png"),
};

const categories = [
  "block",
  "hat",
  "parrot",
  "bone",
  "aqua",
  "purpleHat",
  "tapaOlho",
];

export default function Customizacao() {
  const router = useRouter();
  const { squillImage, setSquillImage } = useSquill();
  const [baseImage, setBaseImage] = useState<ImageSourcePropType>(
    squillImage || baseImages.base
  );

  const handleSelection = (categoryKey: string) => {
    if (categoryKey === "block") {
      setBaseImage(baseImages.base);
      setSquillImage(baseImages.base);
      return;
    }

    const newImage = baseImages[categoryKey];
    if (newImage) {
      setBaseImage(newImage);
      setSquillImage(newImage);
    } else {
      console.warn(`Imagem base para a categoria ${categoryKey} não encontrada.`);
    }
  };

  const screenWidth = Dimensions.get("window").width;
  const itemSize = (screenWidth - 60) / 3; // 3 itens por linha + gaps

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>SQUILL</Text>
        <Text style={styles.customizacao}>Customização</Text>
      </View>

      <View style={styles.baseImageContainer}>
        <Image
          source={baseImage}
          style={{ height: 300, width: 300 }}
          resizeMode="contain"
        />
      </View>

      <View style={styles.acessoriesContainer}>
        {/** Criamos linhas de 3 acessórios cada */}
        {Array.from({ length: Math.ceil(categories.length / 3) }).map((_, rowIndex) => (
          <View key={rowIndex} style={styles.acessoriesRow}>
            {categories
              .slice(rowIndex * 3, rowIndex * 3 + 3)
              .map((item) => (
                <View key={item} style={{ width: itemSize, alignItems: "center", marginHorizontal:-40 }}>
                  <Acessory category={item} onPress={() => handleSelection(item)} />
                </View>
              ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingVertical: 8,
  },
  baseImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  acessoriesContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  acessoriesRow: {
  flexDirection: "row",
  justifyContent: "center", // centraliza os itens
  gap: 10, // adiciona espaço pequeno entre eles (React Native 0.71+)
  marginBottom: 10, // espaço entre linhas
},

  title: {
    fontSize: 40,
    color: Colors.bordaDeAcessorio,
    letterSpacing: 2,
    textAlign: "center",
    fontWeight: "bold",
  },
  customizacao: {
    fontSize: 40,
    backgroundColor: Colors.background,
    width: "100%",
    color: Colors.brown,
    letterSpacing: 2,
    textAlign: "center",
    fontWeight: "bold",
  },
});
