import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import * as Icons from "@/constants/icons";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";

export interface ItemType {
  id: string;
  name: string;
  amount: string;
  date: string;
  category: string;
  percentage?: string;
}

interface SpendingBlockProps {
  storageKey: string;
  title: string;
}

/* -------------------------------------------------------------------------- */
/* 🔹 COMPONENTE DE ANIMAÇÃO — AGORA FORA DO MAP                             */
/* -------------------------------------------------------------------------- */

const AnimatedPopIn = ({ children }: any) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 40,
    }).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      {children}
    </Animated.View>
  );
};

/* -------------------------------------------------------------------------- */

const allCategories = {
  house: { icon: Icons.house, color: Colors.house },
  car: { icon: Icons.car, color: Colors.car },
  fone: { icon: Icons.fone, color: Colors.fone },
  food: { icon: Icons.food, color: Colors.food },
  shop: { icon: Icons.shop, color: Colors.shop },
  clothes: { icon: Icons.clothes, color: Colors.clothes },
  health: { icon: Icons.health, color: Colors.health },
  game: { icon: Icons.game, color: Colors.game },
  tech: { icon: Icons.tech, color: Colors.tech },
  gym: { icon: Icons.gym, color: Colors.gym },
  tv: { icon: Icons.tv, color: Colors.tv },
  quest: { icon: Icons.quest, color: Colors.quest },

  salario: { icon: Icons.salario, color: Colors.salario },
  presente: { icon: Icons.presente, color: Colors.presente },
  bonus: { icon: Icons.bonus, color: Colors.bonus },
  other: { icon: Icons.quest, color: Colors.tvIncome },
};

const categoryIcons: Record<string, any> = {};
const categoryColors: Record<string, string> = {};

Object.entries(allCategories).forEach(([key, { icon, color }]) => {
  categoryIcons[key] = icon;
  categoryColors[key] = color;
});

const getLastThreeMonths = () => {
  const months: { month: number; year: number; label: string }[] = [];
  const now = new Date();
  for (let i = 2; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: d.getMonth(),
      year: d.getFullYear(),
      label:
        d.toLocaleString("default", { month: "long" }) + " " + d.getFullYear(),
    });
  }
  return months.reverse();
};

const SpendingBlock = ({ storageKey, title }: SpendingBlockProps) => {
  const [items, setItems] = React.useState<ItemType[]>([]);
  const [months] = React.useState(getLastThreeMonths());
  const [selectedMonth, setSelectedMonth] = React.useState(months[0]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ItemType | null>(null);
  const [newName, setNewName] = React.useState("");
  const [newAmount, setNewAmount] = React.useState("");
  const [newDate, setNewDate] = React.useState("");
  const [selectedCategory, setSelectedCategory] =
    React.useState<string>("quest");

  React.useEffect(() => {
    const loadData = async () => {
      const data = await AsyncStorage.getItem(storageKey);
      if (data) setItems(JSON.parse(data));
    };
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, [storageKey]);

  const openEditModal = (item: ItemType | null = null) => {
    if (item) {
      setEditingItem(item);
      setNewName(item.name);
      setNewAmount(item.amount);
      setNewDate(item.date);
      setSelectedCategory(item.category);
    } else {
      setEditingItem(null);
      setNewName("");
      setNewAmount("");
      setNewDate("");
      setSelectedCategory("quest");
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!newName || !newAmount || !newDate) return;
    let updated: ItemType[] = [];

    if (editingItem) {
      updated = items.map((e) =>
        e.id === editingItem.id
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
      const newItem: ItemType = {
        id: (items.length + 1).toString(),
        name: newName,
        amount: newAmount,
        date: newDate,
        category: selectedCategory,
      };
      updated = [newItem, ...items];
    }

    setItems(updated);
    await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
    setModalVisible(false);
  };

  const deleteItem = async (id: string) => {
    const filtered = items.filter((e) => e.id !== id);
    setItems(filtered);
    await AsyncStorage.setItem(storageKey, JSON.stringify(filtered));
    setModalVisible(false);
    setEditingItem(null);
  };

  const filteredItems = React.useMemo(() => {
    return items
      .filter((exp) => {
        const [day, month, year] = exp.date.split("/").map(Number);
        const fullYear = year < 100 ? 2000 + year : year;
        return (
          month - 1 === selectedMonth.month && fullYear === selectedMonth.year
        );
      })
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split("/").map(Number);
        const [dayB, monthB, yearB] = b.date.split("/").map(Number);
        const dateA = new Date(2000 + yearA, monthA - 1, dayA);
        const dateB = new Date(2000 + yearB, monthB - 1, dayB);
        return dateB.getTime() - dateA.getTime();
      });
  }, [items, selectedMonth]);

  const totalMonth = filteredItems.reduce(
    (sum, e) => sum + Number(e.amount.replace(/\./g, "").replace(",", ".")),
    0
  );

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: Colors.text,
            fontSize: 20,
            fontWeight: "500",
            marginBottom: 8,
          }}
        >
          {title} de {selectedMonth.label}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <View style={{ flexDirection: "row", gap: 5 }}>
            {months.map((m) => (
              <TouchableOpacity
                key={m.label}
                onPress={() => setSelectedMonth(m)}
                style={{
                  backgroundColor:
                    m.label === selectedMonth.label
                      ? Colors.tintcolor
                      : Colors.grey,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: Colors.textSecondary,
                    fontSize: 14,
                    fontWeight: "700",
                  }}
                >
                  {m.label.split(" ")[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text
            style={{
              color: Colors.text,
              fontSize: 22,
              fontWeight: "800",
              marginLeft: 18,
              flex:1,
            }}
          >
            Total: R$ {totalMonth.toFixed(2)}
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const categoryKey = item.category?.toLowerCase() || "quest";
              const Icon = categoryIcons[categoryKey];
              const color = categoryColors[categoryKey] || Colors.grey;

              const RenderIcon = Icon ? (
                <Icon width={35} height={35} color={Colors.white} />
              ) : (
                <Feather name="help-circle" size={30} color={Colors.white} />
              );

              const percentage =
                totalMonth > 0
                  ? (
                      (parseFloat(item.amount.replace(",", ".")) /
                        totalMonth) *
                      100
                    ).toFixed(0) + "%"
                  : "0%";

              return (
                <AnimatedPopIn key={item.id}>
                  <View style={[styles.block, { backgroundColor: color }]}>
                    <View style={styles.blockLeft}>
                      <View style={styles.iconCircle}>{RenderIcon}</View>
                    </View>

                    <View style={styles.blockContent}>
                      <View style={styles.blockHeader}>
                        <Text style={styles.dateText}>{item.date}</Text>
                        <TouchableOpacity onPress={() => openEditModal(item)}>
                          <Feather
                            name="more-vertical"
                            size={20}
                            color={Colors.white}
                          />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.nameText}>{item.name}</Text>
                      <Text style={styles.categoryText}>
                        {item.category}
                      </Text>

                      <View style={styles.bottomInfo}>
                        <Text style={styles.amountText}>
                          R$ {item.amount}
                        </Text>
                        <Text style={styles.percentText}>
                          {percentage}
                        </Text>
                      </View>
                    </View>
                  </View>
                </AnimatedPopIn>
              );
            })
          ) : (
            <Text
              style={{ color: Colors.textSecondary, fontWeight: "800" }}
            >
              Nenhum registro neste mês
            </Text>
          )}
        </ScrollView>

        {/* Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 16,
                  marginBottom: 10,
                }}
              >
                {editingItem ? "Editar" : "Adicionar"}{" "}
                {title.toLowerCase().slice(0, -1)}
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
                    formatted =
                      cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
                  if (cleaned.length >= 5)
                    formatted += "/" + cleaned.slice(4, 6);
                  setNewDate(formatted);
                }}
              />

              <TouchableOpacity onPress={handleSave} style={styles.addButton}>
                <Text style={{ color: Colors.white, fontWeight: "700" }}>
                  Salvar
                </Text>
              </TouchableOpacity>

              {editingItem && (
                <TouchableOpacity
                  onPress={() => deleteItem(editingItem.id)}
                  style={[
                    styles.addButton,
                    { backgroundColor: "#FF4444", marginTop: 10 },
                  ]}
                >
                  <Text style={{ color: Colors.white, fontWeight: "700" }}>
                    Excluir
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ marginTop: 10 }}
              >
                <Text style={{ color: Colors.white, textAlign: "center" }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.lightBackground,
    borderRadius: 16,
    paddingHorizontal: 20,
    marginTop: 25,
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
  block: {
    flexDirection: "row",
    width: 300,
    borderRadius: 30,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    marginLeft: 10,
  },
  blockLeft: { marginRight: 12 },
  blockContent: { flex: 1 },
  blockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  dateText: { color: Colors.white, fontSize: 12, opacity: 0.9 },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  nameText: { color: Colors.white, fontWeight: "700", fontSize: 16 },
  categoryText: {
    color: Colors.white,
    fontSize: 13,
    opacity: 0.9,
    marginBottom: 4,
  },
  bottomInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountText: { color: Colors.white, fontWeight: "700", fontSize: 16 },
  percentText: { color: Colors.white, fontSize: 14, fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: { backgroundColor: "#222", borderRadius: 15, padding: 20 },
  input: {
    backgroundColor: "#333",
    color: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: Colors.tintcolor,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
});

export default SpendingBlock;
