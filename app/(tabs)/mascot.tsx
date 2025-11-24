import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { Acessory } from '@/components/Acessorio';
import { useState } from 'react';
import { FlatList, Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { useSquill } from "@/context/SquillContext"; // <<< IMPORTANTE

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
  'block',
  'hat',
  'parrot',
  'bone',
  'aqua',
  'purpleHat',
  'tapaOlho',
];

export default function Customizacao() {
  const router = useRouter();
  const { squillImage, setSquillImage } = useSquill(); // <<< AQUI
  const [baseImage, setBaseImage] = useState<ImageSourcePropType>(squillImage || baseImages.base);

  const handleSelection = (categoryKey: string) => { 

    if (categoryKey === "block") {
      setBaseImage(baseImages.base);
      setSquillImage(baseImages.base);   // <<< SALVA GLOBAL
      return;
    }

    const newImage = baseImages[categoryKey];
    if (newImage) {
      setBaseImage(newImage); 
      setSquillImage(newImage);  // <<< SALVA GLOBAL
    } else {
      console.warn(`Imagem base para a categoria ${categoryKey} não encontrada.`);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>SQUILL</Text>
        <Text style={styles.customizacao}>     Customização     </Text>
      </View>
      
      <View style={styles.baseImageContainer}>
        <Image 
          source={baseImage} 
          style={{ height: 300, width: 300 }} 
          resizeMode="contain" 
        />
      </View>

      <View style={styles.acessoriesContainer}>
        <FlatList 
          data={categories} 
          keyExtractor={(item) => item}
          horizontal={true} 
          contentContainerStyle={{
            gap: 4,
            flexWrap: 'wrap', 
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }} 
          renderItem={({ item }) => (
            <Acessory 
              category={item} 
              onPress={() => handleSelection(item)} 
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      backgroundColor: Colors.background,
      paddingVertical: 8
  },
  baseImageContainer: {
      flex: 1,  
      alignItems: "center", 
      justifyContent: "center", 
      width: "100%"
  },
  acessoriesContainer: {
      flex: 1,
      width: '100%',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
      paddingHorizontal: 10, 
  },

  title: {
    fontSize: 40,
    color: Colors.bordaDeAcessorio,
    letterSpacing: 2,
    textAlign: "center",
    alignItems: "center",
    fontWeight: "bold",
  },

  customizacao: {
    fontSize: 40,
    backgroundColor:Colors.background,
    width: "100%",
    color: Colors.brown,
    letterSpacing: 2,
    textAlign: "center",
    alignItems: "center",
    fontWeight: "bold",
  }
});
