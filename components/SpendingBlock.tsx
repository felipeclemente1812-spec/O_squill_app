import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { ExpenseType } from "./ExpenseBlock";

import {
  car,
  clothes,
  fone,
  food,
  game,
  gym,
  health,
  house,
  quest,
  shop,
  tech,
  tv,
} from "@/constants/icons";

const STORAGE_KEY = "@expenses";

const categoryIcons: Record<string, any> = {
  house,
  car,
  fone,
  food,
  shop,
  clothes,
  health,
  game,
  tech,
  gym,
  tv,
  quest,
};

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
  tv: Colors.tv,
  quest: Colors.quest,
};

const getLastThreeMonths = () => {
  const months: { month: number; year: number; label: string }[] = [];
  const now = new Date();
  for (let i = 2; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: d.getMonth(),
      year: d.getFullYear(),
      label:
        d.toLocaleString("default", { month: "long" }) +
        " " +
        d.getFullYear(),
    });
  }
  return months.reverse();
};

const isCurrentWeek = (dateStr: string) => {
  const [day, month, year] = dateStr.split("/").map(Number);
  const fullYear = year < 100 ? 2000 + year : year;
  const d = new Date(fullYear, month - 1, day);

  const now = new Date();
  const dayOfWeek = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - dayOfWeek + 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return d >= start && d <= end;
};

const SpendingBlock = () => {
  const [expenses, setExpenses] = React.useState<ExpenseType[]>([]);
  const [months, setMonths] = React.useState(getLastThreeMonths());
  const [selectedMonth, setSelectedMonth] = React.useState(months[0]);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [editingExpense, setEditingExpense] = React.useState<ExpenseType | null>(null);

  const [newName, setNewName] = React.useState("");
  const [newAmount, setNewAmount] = React.useState("");
  const [newDate, setNewDate] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("quest");

  // Carrega despesas
  React.useEffect(() => {
    const loadExpenses = async () => {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) setExpenses(JSON.parse(data));
    };
    loadExpenses();
  }, []);

  const openEditModal = (expense: ExpenseType | null = null) => {
    if (expense) {
      setEditingExpense(expense);
      setNewName(expense.name);
      setNewAmount(expense.amount);
      setNewDate(expense.date);
      setSelectedCategory(expense.category);
    } else {
      setEditingExpense(null);
      setNewName("");
      setNewAmount("");
      setNewDate("");
      setSelectedCategory("quest");
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!newName || !newAmount || !newDate) return;

    let updatedExpenses: ExpenseType[] = [];

    if (editingExpense) {
      updatedExpenses = expenses.map((e) =>
        e.id === editingExpense.id
          ? {
              ...e,
              name: newName,
              amount: newAmount,
              date: newDate,
              category: selectedCategory,
            }
          : e
      );
    } else {
      const newItem: ExpenseType = {
        id: (expenses.length + 1).toString(),
        name: newName,
        amount: newAmount,
        date: newDate,
        category: selectedCategory,
      };
      updatedExpenses = [newItem, ...expenses];
    }

    setExpenses(updatedExpenses);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedExpenses));
    setModalVisible(false);

    const [day, month, year] = newDate.split("/").map(Number);
    const fullYear = year < 100 ? 2000 + year : year;
    setSelectedMonth({
      month: month - 1,
      year: fullYear,
      label:
        new Date(fullYear, month - 1, 1).toLocaleString("default", {
          month: "long",
        }) + " " + fullYear,
    });
  };

  const deleteExpense = async (id: string) => {
    const filtered = expenses.filter((e) => e.id !== id);
    setExpenses(filtered);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    setModalVisible(false);
    setEditingExpense(null);
  };

  const [filteredExpenses, setFilteredExpenses] = React.useState<ExpenseType[]>([]);

  React.useEffect(() => {
    const filtered = expenses.filter((exp) => {
      const [day, month, year] = exp.date.split("/").map(Number);
      const fullYear = year < 100 ? 2000 + year : year;
      const isSelectedMonth =
        month - 1 === selectedMonth.month && fullYear === selectedMonth.year;

      const isRecentMonth = selectedMonth.month === months[0].month;
      if (isRecentMonth) {
        return isSelectedMonth && !isCurrentWeek(exp.date);
      }

      return isSelectedMonth;
    });

    setFilteredExpenses(filtered);
  }, [expenses, selectedMonth]);

  // Total do mês atual
  const totalMonth = filteredExpenses.reduce(
  (sum, e) => sum + Number(e.amount.replace(/\./g, '').replace(',', '.')),
  0
);


  return (
    <View style={{ flex: 1 }}>
      {/* Cabeçalho */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 5 }}>
        <Text style={{ color: Colors.white, fontSize: 20, fontWeight: "700" }}>
          Despesas de{" "}
          {selectedMonth.label.charAt(0).toUpperCase() + selectedMonth.label.slice(1)}
        </Text>
        <Text style={{ color: Colors.white, fontSize: 16, opacity: 0.8 }}>
          Total: R$ {totalMonth.toFixed(2)}
        </Text>
      </View>

      {/* Meses */}
      <View style={{ flexDirection: "row", gap: 5, marginBottom: 15 }}>
        {months.map((m) => (
          <TouchableOpacity
            key={m.label}
            onPress={() => setSelectedMonth(m)}
            style={{
              backgroundColor: m.label === selectedMonth.label ? Colors.tintcolor : Colors.grey,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: Colors.white, fontSize: 14 }}>
              {m.label.split(" ")[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Blocos */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((item) => {
            const color = categoryColors[item.category?.toLowerCase() || "quest"];
            const Icon = categoryIcons[item.category?.toLowerCase() || "quest"];
            const percentage =
              totalMonth > 0
                ? ((parseFloat(item.amount) / totalMonth) * 100).toFixed(0) + "%"
                : "0%";

            return (
              <View key={item.id} style={[styles.block, { backgroundColor: color }]}>
                <View style={styles.blockLeft}>
                  <View style={styles.iconCircle}>
                    <Icon width={35} height={35} color={Colors.white} />
                  </View>
                </View>
                <View style={styles.blockContent}>
                  <View style={styles.blockHeader}>
                    <Text style={styles.dateText}>{item.date}</Text>
                    <TouchableOpacity onPress={() => openEditModal(item)}>
                      <Feather name="more-vertical" size={20} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.nameText}>{item.name}</Text>
                  <Text style={styles.categoryText}>{item.category}</Text>
                  <View style={styles.bottomInfo}>
                    <Text style={styles.amountText}>R$ {item.amount}</Text>
                    <Text style={styles.percentText}>{percentage}</Text>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={{ color: Colors.white, opacity: 0.7 }}>
            Nenhuma despesa neste mês
          </Text>
        )}
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ color: Colors.white, fontSize: 16, marginBottom: 10 }}>
              {editingExpense ? "Editar gasto" : "Adicionar gasto"}
            </Text>

            <TextInput
              placeholder="Nome"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              placeholder="Valor"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              style={styles.input}
              value={newAmount}
              onChangeText={setNewAmount}
            />
            <TextInput
              placeholder="Data (dd/mm/yy)"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              style={styles.input}
              value={newDate}
              onChangeText={(text) => {
                let cleaned = text.replace(/\D/g, "");
                if (cleaned.length > 6) cleaned = cleaned.slice(0, 6);
                let formatted = "";
                if (cleaned.length >= 1) formatted += cleaned.slice(0, 2);
                if (cleaned.length >= 3)
                  formatted = cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
                if (cleaned.length >= 5) formatted += "/" + cleaned.slice(4, 6);
                setNewDate(formatted);
              }}
            />

            <TouchableOpacity onPress={handleSave} style={styles.addButton}>
              <Text style={{ color: Colors.white, fontWeight: "700" }}>Salvar</Text>
            </TouchableOpacity>

            {editingExpense && (
              <TouchableOpacity onPress={() => deleteExpense(editingExpense.id)} style={[styles.addButton, { backgroundColor: "#FF4444", marginTop: 10 }]}>
                <Text style={{ color: Colors.white, fontWeight: "700" }}>Excluir</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
              <Text style={{ color: Colors.white, textAlign: "center" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    flexDirection: "row",
    width: 300,
    borderRadius: 30,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    marginLeft:10,
  },
  blockLeft: { marginRight: 12 },
  blockContent: { flex: 1 },
  blockHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  dateText: { color: Colors.white, fontSize: 12, opacity: 0.9 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
  nameText: { color: Colors.white, fontWeight: "700", fontSize: 16 },
  categoryText: { color: Colors.white, fontSize: 13, opacity: 0.9, marginBottom: 4 },
  bottomInfo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  amountText: { color: Colors.white, fontWeight: "700", fontSize: 16 },
  percentText: { color: Colors.white, fontSize: 14, fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", paddingHorizontal: 20 },
  modalContent: { backgroundColor: "#222", borderRadius: 15, padding: 20 },
  input: { backgroundColor: "#333", color: Colors.white, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginBottom: 10 },
  addButton: { backgroundColor: Colors.tintcolor, padding: 12, borderRadius: 12, alignItems: "center" },
});

export default SpendingBlock;
