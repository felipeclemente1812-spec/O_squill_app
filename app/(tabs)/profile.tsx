import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import React from "react";
import { StyleSheet, Text, View } from 'react-native';

const Profile = () => {
  return(
          <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.container}>
          <Text style={styles.Text}>transactions</Text>
        </View>
      </>
      )
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.black,
      },
      Text: {
        color: Colors.white,
      },
})
