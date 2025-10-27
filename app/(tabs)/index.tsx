import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { PieChart } from "react-native-gifted-charts";
import ExpenseBlock, { ExpenseType } from '@/components/ExpenseBlock';
import IncomeBlock from '@/components/incomeBlock';
import SpendingBlock from '@/components/SpendingBlock';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface PieSlice {
  id: string;
  value: number;
  color: string;
  text: string;
  percentage: number;
  sliceThickness?: number;
}

const categoryColors: Record<string, string> = {
  house: Colors.house,
  car: Colors.car,
  fone: Colors.fone,
  food: Colors.food,
  shop: Colors.shop,
  clothes: Colors.clothes,
  health: Colors.health,
  game: Colors.game,
  tech: Colors.tech,
  gym: Colors.gym,
  quest: Colors.quest,
};

const STORAGE_KEY = "@expenses";

const Page = () => {
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [pieData, setPieData] = useState<PieSlice[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);

  const getCurrentWeekRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const start = new Date(now);
    start.setDate(now.getDate() - dayOfWeek + 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  };

  const generatePieData = (data: ExpenseType[], selectedId: string | null = null) => {
    const { start, end } = getCurrentWeekRange();

    const weeklyExpenses = data.filter(exp => {
      const [day, month, year] = exp.date.split('/').map(Number);
      const fullYear = 2000 + year;
      const expDate = new Date(fullYear, month - 1, day);
      return expDate >= start && expDate <= end;
    });

    const grouped: Record<string, number> = {};
    weeklyExpenses.forEach(item => {
      const category = item.category || "quest";
      if (!grouped[category]) grouped[category] = 0;
      grouped[category] += Number(item.amount);
    });

    // Reduce seguro mesmo se grouped estiver vazio
    const totalValue = Object.values(grouped).reduce((acc, val) => acc + val, 0);
    setTotal(totalValue);

    const chartData: PieSlice[] = Object.keys(grouped).map(category => ({
      id: category,
      value: grouped[category],
      color: categoryColors[category] || "#CCCCCC",
      text: category,
      percentage: totalValue > 0 ? (grouped[category] / totalValue) * 100 : 0,
      sliceThickness: selectedId === category ? 30 : 20,
    }));

    setPieData(chartData);
  };

  useFocusEffect(
    useCallback(() => {
      const loadExpenses = async () => {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed: ExpenseType[] = data ? JSON.parse(data) : [];
        setExpenses(parsed);
        generatePieData(parsed, selectedSlice);
      };
      loadExpenses();
    }, [selectedSlice])
  );

  const handleExpensesChange = (newExpenses: ExpenseType[]) => {
    setExpenses(newExpenses);
    generatePieData(newExpenses, selectedSlice);
  };

  return (
    <>
      <Stack.Screen options={{ header: () => <Header /> }} />

      <View style={[styles.container, { paddingTop: 40 }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ gap: 10 }}>
              <Text style={{ color: Colors.white, fontSize: 16 }}>
                My <Text style={{ fontWeight: "700" }}>Expenses</Text>
              </Text>
              <Text style={{ color: Colors.white, fontSize: 36, fontWeight: "700" }}>
                R${total.toFixed(2)}
              </Text>
            </View>

            <View style={{ paddingVertical: 0, alignItems: 'center' }}>
              <PieChart
  data={pieData.length > 0 
        ? pieData 
        : [{ id: 'empty', value: 1, color: 'transparent', text: '', percentage: 100 }]}
  donut
  showGradient
  focusOnPress
  radius={70}
  innerRadius={50}
  innerCircleColor={Colors.black}
  centerLabelComponent={() => (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      {pieData.length > 0 
        ? (selectedSlice 
            ? <>
                <Text style={{ color: Colors.white, fontSize: 16, fontWeight: '700' }}>
                  {pieData.find(p => p.id === selectedSlice)?.text}
                </Text>
                <Text style={{ color: Colors.white, fontSize: 14 }}>
                  R${pieData.find(p => p.id === selectedSlice)?.value.toFixed(2)}
                </Text>
                <Text style={{ color: Colors.white, fontSize: 14 }}>
                  {pieData.find(p => p.id === selectedSlice)?.percentage.toFixed(0)}%
                </Text>
              </>
            : <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>Semana</Text>)
        : <Text style={{ fontSize: 18, color: 'white', fontWeight: '700' }}>Sem despesas</Text>
      }
    </View>
  )}
  onPress={(slice: PieSlice) => {
    if (pieData.length === 0) return; // evita clique sem dados
    const newSelected = selectedSlice === slice.id ? null : slice.id;
    setSelectedSlice(newSelected);
    generatePieData(expenses, newSelected);
  }}
/>
            </View>
          </View>

          <ExpenseBlock onChange={handleExpensesChange} />
          <IncomeBlock />
          <SpendingBlock />
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
