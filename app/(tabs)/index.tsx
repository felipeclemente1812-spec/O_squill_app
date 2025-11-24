import Header from "@/components/Header";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import ExpenseBlock, { ExpenseType } from "@/components/ExpenseBlock";
import IncomeBlock, { IncomeType } from "@/components/IncomeBlock";
import SpendingBlock from "@/components/SpendingBlock";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Dashboard from "@/components/Dashboard";
import { SafeAreaView } from "react-native-safe-area-context";

const STORAGE_KEY_EXPENSES = "@expenses";
const STORAGE_KEY_INCOMES = "@incomes";

const { width } = Dimensions.get("window");

const GRAPH_OFFSET = width * 0.12; // espaço definitivo pro gráfico

const Page = () => {
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [incomes, setIncomes] = useState<IncomeType[]>([]);
  const [showExpenses, setShowExpenses] = useState(true);
  const [dataType, setDataType] = useState<"expense" | "income">("expense");
  const [selectedPeriod, setSelectedPeriod] = useState<number>(0);
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);

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

  const calculateWeeklyTotal = (data: any[]) => {
    const { start, end } = getCurrentWeekRange();
    return data
      .filter((item) => {
        if (!item.date) return false;
        const [day, month, year] = item.date.split("/").map(Number);
        const fullYear = year < 100 ? 2000 + year : year;
        const itemDate = new Date(fullYear, month - 1, day);
        return itemDate >= start && itemDate <= end;
      })
      .reduce((acc, item) => acc + Number(item.amount), 0);
  };

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
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <Header />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: 80 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              {/* 🔹 Cabeçalho Total */}
              <View style={styles.headerSection}>
                <View style={styles.totalBlock}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 3,
                    }}
                  >
                    <Text
                      style={{ fontSize: width * 0.045, color: Colors.text }}
                    >
                      Total de{" "}
                      <Text
                        style={{
                          fontSize: width * 0.045,
                          color: Colors.brown,
                          fontWeight: "700",
                        }}
                      >
                        {showExpenses ? "Despesas" : "Receitas"}
                      </Text>
                      {"\n"}
                      <Text
                        style={{
                          fontSize: width * 0.03,
                          color: Colors.textSecondary,
                          fontWeight: "700",
                        }}
                      >
                        (últimos 7 dias)
                      </Text>
                    </Text>

                    <TouchableOpacity
                      style={{ marginLeft: 6, marginTop: -20 }}
                      onPress={() => {
                        setShowExpenses((prev) => !prev);
                        setDataType((prev) =>
                          prev === "expense" ? "income" : "expense"
                        );
                      }}
                    >
                      <Ionicons
                        name="swap-vertical-outline"
                        size={22}
                        color={Colors.brown}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={{
                      fontSize: width * 0.07,
                      color: Colors.darkBrown,
                      fontWeight: "700",
                      marginTop: 4,
                    }}
                  >
                    R${totalValue.toFixed(2)}
                  </Text>
                </View>

                {/* 🔹 Gráfico (agora com espaço garantido!) */}
                <View style={styles.graphContainer}>
                  <Dashboard
                    expenses={expenses}
                    incomes={incomes}
                    dataType={dataType}
                    selectedPeriod={selectedPeriod}
                    selectedSlice={selectedSlice}
                    onSelectSlice={setSelectedSlice}
                    setDataType={setDataType}
                    setSelectedPeriod={setSelectedPeriod}
                  />
                </View>
              </View>

              {/* 🔹 Blocos */}
              {showExpenses ? (
                <>
                  <ExpenseBlock onChange={setExpenses} />
                  <SpendingBlock
                    key="expenses"
                    storageKey="@expenses"
                    title="Despesas"
                  />
                </>
              ) : (
                <>
                  <IncomeBlock onChange={setIncomes} />
                  <SpendingBlock
                    key="incomes"
                    storageKey="@incomes"
                    title="Receitas"
                  />
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Page;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },

  graphContainer: {
    flex: 1,
    minWidth: width * 0.35, // impede o gráfico de esmagar o texto
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 1, // permite reduzir o tamanho quando faltar espaço
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  headerSection: {
    flexDirection: "row",
    alignItems: "center", // garante alinhamento vertical REAL
    justifyContent: "space-between",
    backgroundColor: Colors.lightBackground,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 4,
    marginTop: 2,
    marginBottom: 20,
    shadowColor: Colors.darkBrown,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 3,
    borderColor: Colors.brown,
  },

  totalBlock: {
    flex: 1,
    minWidth: width * 0.45, // garante que ele nunca fique minúsculo
    justifyContent: "center",
  },
});
