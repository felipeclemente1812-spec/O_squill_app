import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import * as Icons from "@/constants/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface IncomeType {
  id: string;
  name: string;
  amount: string;
  date: string;
  category: string;
  percentage?: string;
}

interface IncomeBlockProps {
  onChange?: (newIncome: IncomeType[]) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BLOCK_WIDTH = SCREEN_WIDTH < 360 ? 120 : 150;
const MODAL_WIDTH = SCREEN_WIDTH < 360 ? "95%" : "90%";
const INPUT_FONT = SCREEN_WIDTH < 360 ? 12 : 14;

const categories = [
  { key: "salario", label: "Salário", icon: Icons.salario, color: Colors.salario },
  { key: "presente", label: "Presente", icon: Icons.presente, color: Colors.presente },
  { key: "bonus", label: "Bônus", icon: Icons.bonus, color: Colors.bonus },
  { key: "other", label: "Outros", icon: Icons.quest, color: Colors.tvIncome },
];

const getCategory = (category: string) =>
  categories.find((c) => c.key === category) || categories[categories.length - 1];

const STORAGE_KEY = "@income";

const IncomeBlock: React.FC<IncomeBlockProps> = ({ onChange }) => {
  const [income, setIncome] = React.useState<IncomeType[]>([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editingIncome, setEditingIncome] = React.useState<IncomeType | null>(null);
  const [newName, setNewName] = React.useState("");
  const [newAmount, setNewAmount] = React.useState("");
  const [newDate, setNewDate] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("other");

  React.useEffect(() => {
    const loadIncome = async () => {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed: IncomeType[] = JSON.parse(data);
        setIncome(parsed);
        if (onChange) onChange(parsed);
      }
    };
    loadIncome();
  }, []);

  const saveIncome = async (newIncome: IncomeType[]) => {
    setIncome(newIncome);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newIncome));
    if (onChange) onChange(newIncome);
  };

  const openAddModal = () => {
    setEditingIncome(null);
    setNewName("");
    setNewAmount("");
    setNewDate("");
    setSelectedCategory("other");
    setModalVisible(true);
  };

  const openEditModal = (item: IncomeType) => {
    setEditingIncome(item);
    setNewName(item.name);
    setNewAmount(item.amount);
    setNewDate(item.date);
    setSelectedCategory(item.category);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!newName || !newAmount || !newDate) return;

    let updatedIncome: IncomeType[] = [];

    if (editingIncome) {
      updatedIncome = income.map((e) =>
        e.id === editingIncome.id
          ? { ...e, name: newName, amount: newAmount, date: newDate, category: selectedCategory }
          : e
      );
    } else {
      const newItem: IncomeType = {
        id: (income.length + 1).toString(),
        name: newName,
        amount: newAmount,
        date: newDate,
        category: selectedCategory,
      };
      updatedIncome = [newItem, ...income];
    }

    saveIncome(updatedIncome);
    setModalVisible(false);
  };

  const deleteIncome = (id: string) => {
    const filtered = income.filter((e) => e.id !== id);
    saveIncome(filtered);
    setModalVisible(false);
    setEditingIncome(null);
  };

  return (
    <View style={styles.container}>
      <View style={{ marginVertical: 5, width: "100%" }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <Text style={{ color: Colors.text, fontSize: 22, fontWeight: "bold" }}>Receitas</Text>
          <TouchableOpacity
            onPress={openAddModal}
            style={[styles.addButtonDashed, { marginLeft: 8, paddingHorizontal: 8, paddingVertical: 4, gap: 4, borderWidth: 2.2, marginTop: 8, borderColor: Colors.text }]}
          >
            <Feather name="plus" size={18} color="#ccc" />
            <Text style={{ color: Colors.text, fontWeight: "700", fontSize: 14 }}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ color: Colors.textSecondary, fontSize: 13, fontWeight: "500", marginBottom: 10 }}>
          Últimas receitas registradas
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          {income.map((item) => {
            const category = getCategory(item.category);
            const IconComp = category.icon;
            return (
              <View key={item.id} style={[styles.block, { backgroundColor: category.color }]}>
                <View style={styles.blockHeader}>
                  <Text style={styles.dateText}>{item.date}</Text>
                  <TouchableOpacity onPress={() => openEditModal(item)}>
                    <Feather name="more-vertical" size={18} color={Colors.white} />
                  </TouchableOpacity>
                </View>
                <View style={styles.iconContainer}>
                  <IconComp width={26} height={26} color={'#000'} />
                </View>
                <Text style={styles.nameText}>{item.name}</Text>
                <Text style={styles.categoryText}>{category.label}</Text>
                <View style={styles.bottomInfo}>
                  <Text style={styles.amountText}>R$ {item.amount}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 20 }}>
                  <Text style={{ color: Colors.white, fontSize: 16, marginBottom: 10 }}>
                    {editingIncome ? "Editar receita" : "Adicionar receita"}
                  </Text>

                  <TextInput placeholder="Nome" placeholderTextColor="#aaa" style={styles.input} value={newName} onChangeText={setNewName} />
                  <TextInput placeholder="Valor" placeholderTextColor="#aaa" keyboardType="numeric" style={styles.input} value={newAmount} onChangeText={setNewAmount} />
                  <TextInput
                    placeholder="Data"
                    placeholderTextColor="#aaa"
                    style={styles.input}
                    value={newDate}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      let cleaned = text.replace(/\D/g, "").slice(0, 6);
                      let formatted = "";
                      if (cleaned.length >= 1) formatted += cleaned.slice(0, 2);
                      if (cleaned.length >= 3) formatted += "/" + cleaned.slice(2, 4);
                      if (cleaned.length >= 5) formatted += "/" + cleaned.slice(4, 6);
                      setNewDate(formatted);
                    }}
                  />

                  <Text style={{ color: Colors.white, marginTop: 10, marginBottom: 5 }}>Categoria:</Text>

                  <FlatList
                    data={categories}
                    numColumns={3}
                    scrollEnabled={false}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item }) => {
                      const selected = selectedCategory === item.key;
                      const IconComp = item.icon;
                      return (
                        <TouchableOpacity onPress={() => setSelectedCategory(item.key)} style={[styles.categoryButton, { backgroundColor: selected ? Colors.tintcolor : Colors.grey }]}>
                          <IconComp width={30} height={30} color={'#000'} />
                          <Text style={styles.categoryLabel}>{item.label}</Text>
                        </TouchableOpacity>
                      );
                    }}
                  />

                  <TouchableOpacity onPress={handleSave} style={styles.addButton}>
                    <Text style={{ color: Colors.white, textAlign: "center" }}>Salvar</Text>
                  </TouchableOpacity>

                  {editingIncome && (
                    <TouchableOpacity onPress={() => deleteIncome(editingIncome.id)} style={styles.deleteButton}>
                      <Text style={{ color: Colors.white, textAlign: "center" }}>Excluir</Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>

                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 10 }}>
                  <Text style={{ color: Colors.white, textAlign: "center" }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default IncomeBlock;

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
    color:"#000",
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