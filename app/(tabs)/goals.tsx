import Colors from '@/constants/Colors'
import { Stack } from 'expo-router'
import React from "react"
import { StyleSheet, Text, View } from 'react-native'

const Transactions=() => {
    return(
        <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.Text}>Metas</Text>
      </View>
    </>
    )
}

export default Transactions

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