import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SpendingType } from "@/types";
import Colors from "@/constants/Colors";

    const SpendingBlock = ({spendingList}:{spendingList:SpendingType}) =>{
    return(
        <View>
            <Text style={{
                color: Colors.white,
                fontSize:16,
                

            }}>
            July <Text style={{fontWeight:'700'}}>Spending</Text>
            </Text>
        </View>
    )
}

export default SpendingBlock

const styles = StyleSheet.create({})