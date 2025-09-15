import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import React from "react";
import { StyleSheet, Text, View } from 'react-native';


const Page = () => {
  return (
    <>
      <Stack.Screen options={{ 
        header: () => <Header/> 
        }} />
      <View style={styles.container}>
        <Text> page </Text>
      </View>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingHorizontal: 20,
  },
});