import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import React from "react";
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { PieChart } from "react-native-gifted-charts";

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
            <View>
              <PieChart
          data={pieData}
          donut
          showGradient
          sectionAutoFocus
          radius={90}
          innerRadius={60}
          innerCircleColor={Colors.black}
          centerLabelComponent={() => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text
                  style={{fontSize: 22, color: 'white', fontWeight: 'bold'}}>
                  47%
                </Text>
                <Text style={{fontSize: 14, color: 'white'}}>Excellent</Text>
              </View>
            );
          }}
        />
            </View>
          </View>
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