import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import * as Icons from "@/constants/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ExpenseType {
  id: string;
  name: string;
  amount: string;
  date: string;
  category: string;
  percentage?: string;
}

interface ExpenseBlockProps {
  onChange?: (newExpenses: ExpenseType[]) => void;
}


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BLOCK_WIDTH = SCREEN_WIDTH < 360 ? 120 : 150; // diminui em telas pequenas
const MODAL_WIDTH = SCREEN_WIDTH < 360 ? "95%" : "90%"; // modal ligeiramente maior em telas pequenas
const INPUT_FONT = SCREEN_WIDTH < 360 ? 12 : 14;

const categories = [
  { key: "house", label: "Casa", icon: Icons.house, color: Colors.house },
  { key: "car", label: "Mobilidade", icon: Icons.car, color: Colors.car },
  {
    key: "fone",
    label: "Música / Streaming",
    icon: Icons.fone,
    color: Colors.fone,
  },
  {
    key: "food",
    label: "Comida (iFood)",
    icon: Icons.food,
    color: Colors.food,
  },
  { key: "shop", label: "Mercado", icon: Icons.shop, color: Colors.shop },
  {
    key: "clothes",
    label: "Roupas",
    icon: Icons.clothes,
    color: Colors.clothes,
  },
  { key: "health", label: "Saúde", icon: Icons.health, color: Colors.health },
  { key: "game", label: "Jogos", icon: Icons.game, color: Colors.game },
  { key: "tech", label: "Tecnologia", icon: Icons.tech, color: Colors.tech },
  { key: "gym", label: "Academia", icon: Icons.gym, color: Colors.gym },
  { key: "quest", label: "Outros", icon: Icons.quest, color: Colors.quest },
];

const getCategory = (category: string) =>
  categories.find((c) => c.key === category) ||
  categories[categories.length - 1];

const STORAGE_KEY = "@expenses";

const ExpenseBlock: React.FC<ExpenseBlockProps> = ({ onChange }) => {
  const [expenses, setExpenses] = React.useState<ExpenseType[]>([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editingExpense, setEditingExpense] =
    React.useState<ExpenseType | null>(null);
  const [newName, setNewName] = React.useState("");
  const [newAmount, setNewAmount] = React.useState("");
  const [newDate, setNewDate] = React.useState("");
  const [selectedCategory, setSelectedCategory] =
    React.useState<string>("quest");

  React.useEffect(() => {
    const loadExpenses = async () => {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed: ExpenseType[] = JSON.parse(data);
        setExpenses(parsed);
        if (onChange) onChange(parsed); // envia para o SpendingBlock
      }
    };
    loadExpenses();
  }, []); // <-- somente executa ao montar

  const saveExpenses = async (newExpenses: ExpenseType[]) => {
    setExpenses(newExpenses);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newExpenses));
    if (onChange) onChange(newExpenses);
  };

  const openAddModal = () => {
    setEditingExpense(null);
    setNewName("");
    setNewAmount("");
    setNewDate("");
    setSelectedCategory("quest");
    setModalVisible(true);
  };

  const openEditModal = (expense: ExpenseType) => {
    setEditingExpense(expense);
    setNewName(expense.name);
    setNewAmount(expense.amount);
    setNewDate(expense.date);
    setSelectedCategory(expense.category);
    setModalVisible(true);
  };

  const handleSave = () => {
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

    saveExpenses(updatedExpenses);
    setModalVisible(false);
  };

  const deleteExpense = (id: string) => {
    const filtered = expenses.filter((e) => e.id !== id);
    saveExpenses(filtered);
    setModalVisible(false);
    setEditingExpense(null);
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

  const { start, end } = getCurrentWeekRange();
  const weeklyExpenses = expenses
    .filter((exp) => {
      const [day, month, year] = exp.date.split("/").map(Number);
      const fullYear = 2000 + year;
      const expDate = new Date(fullYear, month - 1, day);
      return expDate >= start && expDate <= end;
    })
    .sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split("/").map(Number);
      const [dayB, monthB, yearB] = b.date.split("/").map(Number);
      const dateA = new Date(2000 + yearA, monthA - 1, dayA);
      const dateB = new Date(2000 + yearB, monthB - 1, dayB);
      return dateB.getTime() - dateA.getTime();
    });

  const totalWeek = weeklyExpenses.reduce(
    (sum, e) => sum + parseFloat(e.amount),
    0
  );
  const weeklyExpensesWithPercent = weeklyExpenses.map((e) => ({
    ...e,
    percentage:
      totalWeek > 0
        ? `${((parseFloat(e.amount) / totalWeek) * 100).toFixed(0)}%`
        : "0%",
  }));

return (
  <View style={styles.container}>
    <View style={{ marginVertical: 5, width: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text
          style={{ color: Colors.text, fontSize: 22, fontWeight: "bold" }}
        >
          Despesas
        </Text>

        <TouchableOpacity
          onPress={openAddModal}
          style={[
            styles.addButtonDashed,
            {
              marginLeft: 8,
              paddingHorizontal: 8,
              paddingVertical: 4,
              gap: 4,
              borderWidth: 2.2,
              marginTop: 8,
              borderColor: Colors.text,
            },
          ]}
        >
          <Feather name="plus" size={18} color="#ccc" />
          <Text style={{ color: Colors.text, fontWeight: "700", fontSize: 14 }}>
            Adicionar
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          color: Colors.textSecondary,
          fontSize: 13,
          fontWeight: "500",
          marginBottom: 10,
        }}
      >
        Últimos gastos registrados
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {expenses.map((item) => {
  const category = getCategory(item.category);
  const IconComp = category.icon;

  return (
    <Pressable
      key={item.id}
      style={[styles.block, { backgroundColor: category.color }]}
      onPressIn={() => {}} // mantém toque sem abrir modal
    >
      <View style={styles.blockHeader}>
        <Text style={styles.dateText}>{item.date}</Text>

        {/* Ícone que abre o modal */}
        <Pressable onPress={() => openEditModal(item)}>
          <Feather
            name="more-vertical"
            size={18}
            color={Colors.white}
          />
        </Pressable>
      </View>

      <View style={styles.iconContainer}>
        <IconComp width={26} height={26} color={Colors.white} />
      </View>

      <Text style={styles.nameText}>{item.name}</Text>
      <Text style={styles.categoryText}>{category.label}</Text>

      <View style={styles.bottomInfo}>
        <Text style={styles.amountText}>R$ {item.amount}</Text>
      </View>
    </Pressable>
  );
})}
      </ScrollView>
    </View>

    {/* ---------------- MODAL COMPLETO (copiado do 1º código) ---------------- */}
    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: 16,
                    marginBottom: 10,
                  }}
                >
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
                  placeholder="Data"
                  placeholderTextColor="#aaa"
                  style={styles.input}
                  value={newDate}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    let cleaned = text.replace(/\D/g, "");
                    if (cleaned.length > 6) cleaned = cleaned.slice(0, 6);

                    let formatted = "";
                    if (cleaned.length >= 1) formatted += cleaned.slice(0, 2);
                    if (cleaned.length >= 3)
                      formatted = cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
                    if (cleaned.length >= 5)
                      formatted += "/" + cleaned.slice(4, 6);

                    setNewDate(formatted);
                  }}
                />

                <Text
                  style={{ color: Colors.white, marginTop: 10, marginBottom: 5 }}
                >
                  Categoria:
                </Text>

                <FlatList
                  data={categories}
                  numColumns={3}
                  scrollEnabled={false}
                  keyExtractor={(item) => item.key}
                  renderItem={({ item }) => {
                    const IconComp = item.icon;
                    const selected = selectedCategory === item.key;

                    return (
                      <TouchableOpacity
                        onPress={() => setSelectedCategory(item.key)}
                        style={[
                          styles.categoryButton,
                          {
                            backgroundColor: selected
                              ? Colors.tintcolor
                              : Colors.grey,
                          },
                        ]}
                      >
                        <IconComp width={30} height={30} color={Colors.white} />
                        <Text style={styles.categoryLabel}>{item.label}</Text>
                      </TouchableOpacity>
                    );
                  }}
                />

                <TouchableOpacity onPress={handleSave} style={styles.addButton}>
                  <Text style={{ color: Colors.white, textAlign: "center" }}>
                    Salvar
                  </Text>
                </TouchableOpacity>

                {editingExpense && (
                  <TouchableOpacity
                    onPress={() => deleteExpense(editingExpense.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={{ color: Colors.white, textAlign: "center" }}>
                      Excluir
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ padding: 10 }}
              >
                <Text style={{ color: Colors.white, textAlign: "center" }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>

  </View>
);
};

export default ExpenseBlock;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.lightBackground,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 0,
    marginVertical: 0,
    shadowColor: Colors.darkBrown,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 3,
    borderColor: Colors.brown,
    borderStyle: "solid",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  scrollContainer: {
    paddingVertical: 8,
    gap: 12,
  },
  block: {
    width: BLOCK_WIDTH,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    justifyContent: "space-between",
  },
  blockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: "600",
    opacity: 0.9,
  },
  iconContainer: {
    alignSelf: "center",
    marginVertical: 6,
  },
  nameText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 13,
    textAlign: "center",
  },
  categoryText: {
    color: Colors.white,
    opacity: 0.85,
    fontSize: 11,
    textAlign: "center",
  },
  amountText: { color: Colors.white, fontWeight: "bold", fontSize: 15 },
  bottomInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  percentText: { color: Colors.white, fontSize: 11, fontWeight: "700" },
  addButtonDashed: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#666",
    borderStyle: "dashed",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "rgba(0,0,0,0.9)",
    padding: 20,
    borderRadius: 15,
    width: MODAL_WIDTH,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  input: {
    color: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.white,
    marginBottom: 10,
    fontSize: INPUT_FONT,
  },
  categoryButton: {
    flex: 1,
    alignItems: "center",
    margin: 5,
    padding: 10,
    borderRadius: 10,
  },
  categoryLabel: {
    color:'#000',
    fontSize: 11,
    marginTop: 3,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: Colors.tintcolor,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "#ff3333",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
});