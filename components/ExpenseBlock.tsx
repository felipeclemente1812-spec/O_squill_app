import { ListRenderItem, FlatList, StyleSheet, Text, View } from "react-native";
import React from 'react'
import { ExpenseType } from "@/types"
import Colors from "@/constants/Colors"

const ExpenseBlock = ({ expensList }: { expensList: ExpenseType[] }) => {

    const renderItem:ListRenderItem<Partial<ExpenseType>> = ({item}) =>{
        let amount = item.amount?.split('.');
        return(
            <View style={[
                styles.expenseBlock,
                 {
                    backgroundColor: 
                    item.name =='Food' 
                    ? Colors.blue
                    : item.name =='Saving'
                    ? Colors.white
                    : Colors.tintcolor
            }
            ]}>
                <Text style={styles.expenseBlockTxt1}>{item.name}</Text>
                <Text style={styles.expenseBlockTxt2}>${amount[0]}.<Text style={styles.expenseBlockTxt2Span}>{amount[1]}</Text></Text>
                <View style={styles.expenseBlock3View}>
                <Text style={styles.expenseBlockTxt3}>{item.percentage}</Text>
                </View>
            </View>
        )
    }
    return(
        <View>
            <FlatList data={expensList} renderItem={renderItem} 
            horizontal showsHorizontalScrollIndicator={false}/>
        </View>
    )
}

export default ExpenseBlock;

const styles = StyleSheet.create({
    expenseBlock:{
        backgroundColor: Colors.tintcolor,
        width: 100,
        padding: 15,
        borderRadius:15,
        marginRight:20,
        gap:8,
        justifyContent:'space-between',
        alignItems:'flex-start'
    },
    expenseBlockTxt3:{

    },

    expenseBlockTxt1:{
        color: Colors.white,
        fontSize: 14,
    },

    expenseBlockTxt2:{
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    expenseBlockTxt2Span:{
        fontSize: 12,
        fontWeight: '400',
    },
    expenseBlock3View:{
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius:10,
    }
});