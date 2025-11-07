import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import ExpenseBlock, { ExpenseType } from '@/components/ExpenseBlock';
import IncomeBlock, { IncomeType } from '@/components/IncomeBlock';
import SpendingBlock from '@/components/SpendingBlock';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Dashboard from '@/components/Dashboard';

const STORAGE_KEY_EXPENSES = "@expenses";
const STORAGE_KEY_INCOMES = "@incomes";

const Page = () => {
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [incomes, setIncomes] = useState<IncomeType[]>([]);
  const [showExpenses, setShowExpenses] = useState(true);
  const [dataType, setDataType] = useState<'expense' | 'income'>('expense');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(0);
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);

  // 🔹 Calcula intervalo da semana
  const getCurrentWeekRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const start = new Date(now);
    start.setDate(now.getDate() - dayOfWeek);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  };

  // 🔹 Calcula total semanal
  const calculateWeeklyTotal = (data: any[]) => {
    const { start, end } = getCurrentWeekRange();
    return data
      .filter(item => {
        if (!item.date) return false;
        const [day, month, year] = item.date.split('/').map(Number);
        const fullYear = year < 100 ? 2000 + year : year;
        const itemDate = new Date(fullYear, month - 1, day);
        return itemDate >= start && itemDate <= end;
      })
      .reduce((acc, item) => acc + Number(item.amount), 0);
  };

  // 🔹 Carregar dados ao abrir a tela
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const expData = await AsyncStorage.getItem(STORAGE_KEY_EXPENSES);
        const parsedExp: ExpenseType[] = expData ? JSON.parse(expData) : [];
        setExpenses(parsedExp);

        const incData = await AsyncStorage.getItem(STORAGE_KEY_INCOMES);
        const parsedInc: IncomeType[] = incData ? JSON.parse(incData) : [];
        setIncomes(parsedInc);
      };
      loadData();
    }, [])
  );

  const totalExpense = calculateWeeklyTotal(expenses);
  const totalIncome = calculateWeeklyTotal(incomes);
  const totalValue = showExpenses ? totalExpense : totalIncome;

  return (
    <>
      <Stack.Screen options={{ header: () => <Header /> }} />

      <View style={[styles.container, { paddingTop: 10 }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 🔹 Cabeçalho Total */}
          <View style={[styles.headerSection, { paddingTop: 30 }]}>
            <View>
              {/* Total de Despesas/Receitas */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                <Text style={{ color: Colors.white, fontSize: 20 }}>
                  Total de <Text style={{ fontWeight: "700" }}>
                    {showExpenses ? "Despesas" : "Receitas"}
                  </Text>
                  {"\n"}
          <Text style={{ color: Colors.white, fontSize: 12, marginTop: 4 }}>
                (últimos 7 dias)
            </Text>
                </Text>
                <TouchableOpacity
                  style={{ marginLeft: 5, marginTop:-20 }}
                  onPress={() => {
                    setShowExpenses(prev => !prev);
                    setDataType(prev => prev === 'expense' ? 'income' : 'expense');
                  }}
                >
                  <Ionicons
                    name={showExpenses ? "arrow-down-circle-outline" : "arrow-up-circle-outline"}
                    size={22}
                    color={Colors.white}
                  />
                </TouchableOpacity>
              </View>
              <Text style={{ color: Colors.white, fontSize: 36, fontWeight: "700" }}>
                R${totalValue.toFixed(2)}
              </Text>
            </View>

            {/* 🔹 Dashboard */}
            <View style={styles.dashboardContainer}>
              <Dashboard
                expenses={expenses}
                incomes={incomes}
                dataType={dataType}
                selectedPeriod={selectedPeriod}
                selectedSlice={selectedSlice}
                onSelectSlice={(sliceId) => setSelectedSlice(sliceId)}
                setDataType={setDataType}
                setSelectedPeriod={setSelectedPeriod}
              />
            </View>
          </View>

          {/* 🔹 Blocos de Controle */}
          {showExpenses ? (
  <>
    <ExpenseBlock onChange={(data) => setExpenses(data)} />
    <SpendingBlock storageKey="@expenses" title="Despesas" />
  </>
) : (
  <>
    <IncomeBlock onChange={(data) => setIncomes(data)} />
    <SpendingBlock storageKey="@income" title="Receitas" />
  </>
)}

        </ScrollView>
      </View>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey,
    paddingHorizontal: 20,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dashboardContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
