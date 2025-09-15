import Colors from '@/constants/Colors';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const Header = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.black }}>
      <View style={{ flexDirection: 'row', justifyContent: "space-between", height: 70, alignItems: 'center', paddingHorizontal: 20 }}>
        <Image
          source={{ uri: "https://i.pravatar.cc/250?u=12" }}
          style={{ height: 50, width: 50, borderRadius: 30 }}
        />
        <TouchableOpacity
        onPress={() => {}} 
        style={{ 
          borderColor: '#666',
          borderWidth: 1,
          padding: 8,
          borderRadius: 10 }} >
          <Text style={{ color: Colors.white, fontSize: 12 }}>
            My Transactions
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
};

export default Header;

const styles = StyleSheet.create({});