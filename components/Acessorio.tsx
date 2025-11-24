import Colors from '@/constants/Colors';
import React from 'react';
import { Image, StyleSheet, ImageSourcePropType, TouchableOpacity } from 'react-native';

interface AcessoryProps {
  category: string;
  onPress: () => void; 
}

const Categories: Record<string, ImageSourcePropType> = { 
  block:require("@/assets/acessorios/block.png"), 
  hat: require("@/assets/acessorios/hat.png"), 
  parrot: require("@/assets/acessorios/parrot.png"), 
  bone: require("@/assets/acessorios/bone.png"),
  aqua: require("@/assets/acessorios/aqua.png"),
  tapaOlho: require("@/assets/acessorios/tapaOlho.png"),
  purpleHat: require("@/assets/acessorios/purpleHat.png"),
  add: require("@/assets/acessorios/add.png"), 
};

export function Acessory({ category, onPress }: AcessoryProps) {
  const source = Categories[category];

  if (!source) return null;

  return (
  
    <TouchableOpacity style={Styles.acessoryContainer} onPress={onPress}>
      <Image 
          source={source} 
          style={{ height: 60, width: 60 }} 
      />
    </TouchableOpacity>
  );
}


const Styles = StyleSheet.create({
    acessoryContainer: {
        borderWidth: 1,
        backgroundColor: Colors.fundoAcessorio ,
        width: 80,
        height: 80,
        borderRadius: 14,
        borderColor: Colors.bordaDeAcessorio,
        alignItems: "center",
        justifyContent: "center",
        elevation: 3
        
    },
})
