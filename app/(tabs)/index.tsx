import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import React from "react";
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { PieChart } from "react-native-gifted-charts";
import ExpenseBlock from '@/components/ExpenseBlock'
import expensList from '@/data/expenses.json';
import { ExpenseType } from "@/types";
import IncomeBlock from '@/components/incomeBlock';
import incomeList from '@/data/income.json';
import SpendingBlock from '@/components/SpendingBlock';
import spendingList from '@/data/spending.json';

const expenseList = expensList as ExpenseType[]

const Page = () => {
  const pieData = [
  {
    value:47,
    color: Colors.tintcolor,
    focused: true,
    text: "47%"
  },
  {
    value:47,
    color:Colors.blue,
    text: "47%"
  },
  {
    value:16,
    color: Colors.white,
    text:"16%",
  },
  {value:3, color:"#FFA5BA", gradientCenterColor:"#FF7F97", text:"excelent" }
  ];
  return (
    <>
      <Stack.Screen options={{ 
        header: () => <Header/> 
      }} />
      
      <View style={[styles.container, { paddingTop: 40 }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <View style={{gap: 10 }}>
            <Text style={{ color: Colors.white, fontSize: 16 }}>
              My <Text style={{ fontWeight: 700 }}>Expenses</Text>
            </Text>
            
            <Text style={{ color: Colors.white, fontSize: 36, fontWeight: 700}}>
              R$1475.<Text style={{ fontSize: 22, fontWeight: 400 }}>00</Text>
            </Text>
          </View>
            <View style={{paddingVertical: 0 ,alignItems:'center'}}>
              <PieChart
          data={pieData}
          donut
          showGradient
          focusOnPress
          sectionAutoFocus
          radius={70}
          innerRadius={50}
          innerCircleColor={Colors.black}
          centerLabelComponent={() => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text
                  style={{fontSize: 22, color: 'white', fontWeight: 'bold'}}>
                  47%
                </Text>
              </View>
            );
          }}
        />
            </View>
          </View>

          <ExpenseBlock expenseList={expenseList} />

          <IncomeBlock incomeList={incomeList} />

          <SpendingBlock spendingList={spendingList}/>
        </ScrollView>
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