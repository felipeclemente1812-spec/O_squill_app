import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import React from "react";
import { StyleSheet, Text, View } from 'react-native';

const Mascot = () => {
  return(
            <>
          <Stack.Screen options={{ headerShown: false }} />
          <View style={styles.container}>
            <Text style={styles.Text}>personalize o boneco</Text>
          </View>
        </>
        )
};

export default Mascot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#000000ff',
  },
  Text: {
    color: Colors.white,
    fontSize: 18,
  },
});
