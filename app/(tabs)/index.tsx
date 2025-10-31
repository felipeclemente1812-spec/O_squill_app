import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { PieChart } from "react-native-gifted-charts";
import ExpenseBlock, { ExpenseType } from '@/components/ExpenseBlock';
import IncomeBlock from '@/components/incomeBlock';
import SpendingBlock from '@/components/SpendingBlock';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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
  const [modalSelectVisible, setModalSelectVisible] = useState(false);
  const [dataType, setDataType] = useState<'expense' | 'income'>('expense');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(0);

  const getLastThreeMonths = () => {
    const now = new Date();
    const months = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ month: d.getMonth(), year: d.getFullYear(), name: d.toLocaleString('default', { month: 'long' }) });
    }
    return months;
  };

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
    let start: Date;
    let end: Date;

    if (selectedPeriod === 0) {
      ({ start, end } = getCurrentWeekRange());
    } else {
      const monthData = getLastThreeMonths()[selectedPeriod - 1];
      start = new Date(monthData.year, monthData.month, 1);
      end = new Date(monthData.year, monthData.month + 1, 0, 23, 59, 59, 999);
    }

    const filteredData = data.filter(exp => {
      const [day, month, year] = exp.date.split('/').map(Number);
      const fullYear = 2000 + year;
      const expDate = new Date(fullYear, month - 1, day);

      if (dataType === 'expense') return exp.type !== 'income' && expDate >= start && expDate <= end;
      return exp.type === 'income' && expDate >= start && expDate <= end;
    });

    const grouped: Record<string, { value: number; name: string }> = {};
    filteredData.forEach(item => {
      const category = item.category || "quest";
      if (!grouped[category]) grouped[category] = { value: 0, name: item.name };
      grouped[category].value += Number(item.amount);
    });

    const totalValue = Object.values(grouped).reduce((acc, val) => acc + val.value, 0);
    setTotal(totalValue);

    const chartData: PieSlice[] = Object.keys(grouped).map(category => ({
      id: category,
      value: grouped[category].value,
      color: categoryColors[category] || "#CCCCCC",
      text: grouped[category].name,
      percentage: totalValue > 0 ? (grouped[category].value / totalValue) * 100 : 0,
      sliceThickness: selectedId === category ? 35 : 20,
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
    }, [selectedSlice, dataType, selectedPeriod])
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
                Minhas <Text style={{ fontWeight: "700" }}>Despesas</Text>
              </Text>
              <Text style={{ color: Colors.white, fontSize: 36, fontWeight: "700" }}>
                R${total.toFixed(2)}
              </Text>
            </View>

            <View style={{ paddingVertical: 0, alignItems: 'center', width: 150, height: 150 }}>
              <View style={{ position: 'absolute', top: 14, left:-15, zIndex: 10 }}>
                <TouchableOpacity onPress={() => setModalSelectVisible(true)}>
                    <Ionicons name="chevron-down-circle-outline" size={28} color={Colors.white} />
                </TouchableOpacity>
              </View>

              <PieChart
                data={pieData.length > 0
                  ? pieData
                  : [{ id: 'empty', value: 1, color: 'transparent', text: '', percentage: 100 }]
                }
                donut
                showGradient
                radius={70}
                toggleFocusOnPress
                innerRadius={50}
                innerCircleColor={Colors.black}
                focusOnPress
                centerLabelComponent={() => {
                  if (!selectedSlice) {
                    return <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>
                      {selectedPeriod === 0 ? "Semana" : getLastThreeMonths()[selectedPeriod - 1].name}
                    </Text>;
                  }

                  const slice = pieData.find(p => p.id === selectedSlice);
                  if (!slice) return null;

                  return (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ color: Colors.white, fontSize: 16, fontWeight: '700' }}>
                        {slice.text}
                      </Text>
                      <Text style={{ color: Colors.white, fontSize: 14 }}>
                        R${slice.value.toFixed(2)}
                      </Text>
                      <Text style={{ color: Colors.white, fontSize: 14 }}>
                        {slice.percentage.toFixed(0)}%
                      </Text>
                    </View>
                  );
                }}
                onPress={(slice: PieSlice) => {
                  if (pieData.length === 0) return;
                  const newSelected = selectedSlice === slice.id ? null : slice.id;
                  setSelectedSlice(newSelected);

                  setPieData(prev =>
                    prev.map(p => ({ ...p, sliceThickness: p.id === newSelected ? 35 : 20 }))
                  );
                }}
              />

              <Modal
                visible={modalSelectVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalSelectVisible(false)}
              >
                <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center' }}>
                  <View style={{ backgroundColor: Colors.black, padding: 20, borderRadius: 15, width: '80%' }}>
                    <Text style={{ color: Colors.white, fontSize:16, fontWeight:'700', marginBottom:10 }}>Selecionar Período</Text>

                    {getLastThreeMonths().map((m, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          backgroundColor: selectedPeriod === index + 1 ? Colors.tintcolor : Colors.grey,
                          padding: 10,
                          borderRadius: 8,
                          marginVertical: 5
                        }}
                        onPress={() => {
                          setSelectedPeriod(index + 1);
                          setModalSelectVisible(false);
                        }}
                      >
                        <Text style={{ color: Colors.white, textAlign:'center', textTransform:'capitalize' }}>{m.name}</Text>
                      </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                      style={{
                        backgroundColor: selectedPeriod === 0 ? Colors.tintcolor : Colors.grey,
                        padding: 10,
                        borderRadius: 8,
                        marginVertical: 5
                      }}
                      onPress={() => {
                        setSelectedPeriod(0);
                        setModalSelectVisible(false);
                      }}
                    >
                      <Text style={{ color: Colors.white, textAlign:'center' }}>Última Semana</Text>
                    </TouchableOpacity>

                    <Text style={{ color: Colors.white, fontSize:16, fontWeight:'700', marginVertical:10 }}>Tipo de dado</Text>

                    <View style={{ flexDirection:'row', justifyContent:'space-around' }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: dataType === 'expense' ? Colors.tintcolor : Colors.grey,
                          padding: 10,
                          borderRadius: 8,
                          width:'45%'
                        }}
                        onPress={() => setDataType('expense')}
                      >
                        <Text style={{ color: Colors.white, textAlign:'center' }}>Gasto</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          backgroundColor: dataType === 'income' ? Colors.tintcolor : Colors.grey,
                          padding: 10,
                          borderRadius: 8,
                          width:'45%'
                        }}
                        onPress={() => setDataType('income')}
                      >
                        <Text style={{ color: Colors.white, textAlign:'center' }}>Receita</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={{ backgroundColor: Colors.tintcolor, marginTop: 15, padding:10, borderRadius:8 }}
                      onPress={() => setModalSelectVisible(false)}
                    >
                      <Text style={{ color: Colors.white, textAlign:'center', fontWeight:'700' }}>Fechar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

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
