import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import { Feather } from "@expo/vector-icons";

export interface Goal {
  id: string;
  name: string;
  description: string;
  color: string;
  targetValue: number;
  currentValue: number;
  targetDate: string;
  createdAt: string;
}

const STORAGE_KEY = "@goals_v3";

const PRESET_COLORS = [
  "#6b4d1f",
  "#2a9d8f",
  "#e76f51",
  "#f4a261",
  "#264653",
  "#9b5de5",
];

const GoalsScreen = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [addValueModal, setAddValueModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [addAmount, setAddAmount] = useState("");

  // Carrega metas
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) setGoals(JSON.parse(data));
      } catch (error) {
        console.error("Erro ao carregar metas:", error);
      }
    };
    loadGoals();
  }, []);

  // Salva metas
  const saveGoals = async (newGoals: Goal[]) => {
    try {
      setGoals(newGoals);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newGoals));
    } catch (error) {
      console.error("Erro ao salvar metas:", error);
    }
  };

  // Adicionar ou editar meta
  const handleSave = () => {
    if (!name || !value || !targetDate) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos!");
      return;
    }

    const newGoal: Goal = {
      id: editingGoal ? editingGoal.id : Date.now().toString(),
      name,
      description,
      color,
      targetValue: parseFloat(value),
      currentValue: editingGoal ? editingGoal.currentValue : 0,
      targetDate,
      createdAt: editingGoal ? editingGoal.createdAt : new Date().toISOString(),
    };

    const updatedGoals = editingGoal
      ? goals.map((g) => (g.id === editingGoal.id ? newGoal : g))
      : [newGoal, ...goals];

    saveGoals(updatedGoals);
    closeModal();
  };

  // Adiciona valor a uma meta
  const handleAddValue = () => {
    if (!addAmount || isNaN(parseFloat(addAmount))) {
      Alert.alert("Valor inválido", "Digite um valor válido.");
      return;
    }

    if (!selectedGoal) return;

    const updatedGoals = goals.map((g) =>
      g.id === selectedGoal.id
        ? { ...g, currentValue: g.currentValue + parseFloat(addAmount) }
        : g
    );

    saveGoals(updatedGoals);
    setAddAmount("");
    setAddValueModal(false);
  };

  // Excluir meta
  const handleDelete = (id: string) => {
    Alert.alert("Confirmar exclusão", "Deseja realmente excluir esta meta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          const filtered = goals.filter((g) => g.id !== id);
          saveGoals(filtered);
          closeModal();
        },
      },
    ]);
  };

  // Modal de nova meta
  const openAddModal = () => {
    setEditingGoal(null);
    setName("");
    setDescription("");
    setValue("");
    setTargetDate("");
    setColor(PRESET_COLORS[0]);
    setModalVisible(true);
  };

  // Modal de edição
  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setName(goal.name);
    setDescription(goal.description);
    setValue(goal.targetValue.toString());
    setTargetDate(goal.targetDate);
    setColor(goal.color);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingGoal(null);
  };

  // Formatar data como dd/mm/yy
  const handleDateChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 2 && cleaned.length <= 4)
      cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    else if (cleaned.length > 4)
      cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 6)}`;
    setTargetDate(cleaned);
  };

  // Tempo restante
  const getTimeRemaining = (targetDate: string) => {
    const [dd, mm, yy] = targetDate.split("/").map(Number);
    const formattedYear = yy < 100 ? 2000 + yy : yy;
    const target = new Date(formattedYear, mm - 1, dd);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return "Encerrada";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 30) return `${days} dia${days > 1 ? "s" : ""}`;
    if (days < 365) return `${Math.floor(days / 30)} mês(es)`;
    return `${Math.floor(days / 365)} ano(s)`;
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <Text style={styles.title}>METAS</Text>

        {goals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Você ainda não tem metas cadastradas</Text>
            <Text style={styles.emptySubText}>Clique em "Incluir Meta" para começar.</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            {goals.map((goal) => {
              const remaining = getTimeRemaining(goal.targetDate);
              const progress = Math.min(
                (goal.currentValue / goal.targetValue) * 100,
                100
              );

              return (
                <View
                  key={goal.id}
                  style={[styles.goalBox, { backgroundColor: goal.color }]}
                >
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalTitle}>{goal.name}</Text>
                    <TouchableOpacity onPress={() => openEditModal(goal)}>
                      <Feather name="more-vertical" size={20} color={Colors.white} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.goalRemaining}>{remaining}</Text>

                  {goal.description ? (
                    <Text style={styles.goalDesc}>{goal.description}</Text>
                  ) : null}

                  <View style={styles.progressBar}>
                    <View
                      style={[styles.progressFill, { width: `${progress}%` }]}
                    />
                  </View>

                  <View style={styles.progressTextRow}>
                    <Text style={styles.progressValue}>
                      R${goal.currentValue.toFixed(2)}
                    </Text>
                    <Text style={styles.progressValue}>
                      R${goal.targetValue.toFixed(2)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.addMoneyButton}
                    onPress={() => {
                      setSelectedGoal(goal);
                      setAddValueModal(true);
                    }}
                  >
                    <Feather name="plus" size={18} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        )}

        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Text style={styles.addButtonText}>INCLUIR META</Text>
        </TouchableOpacity>

        {/* Modal de criação/edição */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editingGoal ? "Editar Meta" : "Nova Meta"}
              </Text>

              <TextInput
                placeholder="Nome da meta"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />

              <TextInput
                placeholder="Descrição (opcional)"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={description}
                onChangeText={setDescription}
              />

              <TextInput
                placeholder="Valor que deseja atingir (R$)"
                placeholderTextColor="#aaa"
                style={styles.input}
                keyboardType="numeric"
                value={value}
                onChangeText={setValue}
              />

              <TextInput
                placeholder="Prazo (dd/mm/yy)"
                placeholderTextColor="#aaa"
                style={styles.input}
                keyboardType="numeric"
                value={targetDate}
                onChangeText={handleDateChange}
                maxLength={8}
              />

              <Text style={styles.colorLabel}>Escolha uma cor:</Text>
              <View style={styles.colorRow}>
                {PRESET_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: c },
                      color === c && styles.selectedColor,
                    ]}
                    onPress={() => setColor(c)}
                  />
                ))}
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>

              {editingGoal && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(editingGoal.id)}
                >
                  <Text style={styles.saveButtonText}>Excluir</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={closeModal} style={{ padding: 10 }}>
                <Text style={{ color: Colors.white, textAlign: "center" }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal de adicionar dinheiro */}
        <Modal visible={addValueModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adicionar valor à meta</Text>
              <TextInput
                placeholder="Valor (R$)"
                placeholderTextColor="#aaa"
                style={styles.input}
                keyboardType="numeric"
                value={addAmount}
                onChangeText={setAddAmount}
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddValue}
              >
                <Text style={styles.saveButtonText}>Adicionar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAddValueModal(false)}
                style={{ padding: 10 }}
              >
                <Text style={{ color: Colors.white, textAlign: "center" }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default GoalsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black, padding: 20 },
  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.white,
    marginVertical: 10,
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: Colors.white, fontSize: 18, fontWeight: "bold" },
  emptySubText: { color: "#aaa", fontSize: 14, marginTop: 4 },
  goalBox: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    position: "relative",
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  goalRemaining: {
    color: "#f9e48d",
    fontSize: 13,
  },
  goalDesc: {
    color: "#ddd",
    fontSize: 13,
    marginBottom: 8,
  },
  progressBar: {
    height: 18,
    backgroundColor: "#f9e48d",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6b4d1f",
  },
  progressTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  progressValue: { color: Colors.white, fontSize: 13 },
  addMoneyButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 6,
    borderRadius: 20,
  },
  addButton: {
    backgroundColor: "#6b4d1f",
    paddingVertical: 14,
    borderRadius: 10,
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    backgroundColor: Colors.grey,
    width: "90%",
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    color: Colors.white,
    borderBottomWidth: 1,
    borderColor: "#999",
    marginBottom: 12,
    paddingVertical: 6,
  },
  colorLabel: {
    color: Colors.white,
    marginBottom: 6,
    fontSize: 14,
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedColor: {
    borderColor: Colors.white,
  },
  saveButton: {
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
  saveButtonText: { color: Colors.white, textAlign: "center" },
});