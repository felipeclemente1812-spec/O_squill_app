import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

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

  const [modos, setModos] = useState<{ [id: string]: "mes" | "dia" }>({});

  // -----------------------
  // Animated values ref (1 hook only)
  // -----------------------
  const animatedWidthsRef = useRef<{
    [id: string]: Animated.Value | undefined;
  }>({});

  const animatedScaleRef = useRef<{ [id: string]: Animated.Value }>({});
  const existingGoalsRef = useRef<Set<string>>(new Set());

  // ---------- Animação pop-in ----------
  useEffect(() => {
    goals.forEach((goal) => {
      if (!existingGoalsRef.current.has(goal.id)) {
        animatedScaleRef.current[goal.id] = new Animated.Value(0);

        Animated.spring(animatedScaleRef.current[goal.id], {
          toValue: 1,
          useNativeDriver: true,
          friction: 6,
          tension: 50,
        }).start();

        existingGoalsRef.current.add(goal.id);
      }
    });
  }, [goals]);

  // Animação da barra de progresso
  useEffect(() => {
    goals.forEach((goal) => {
      if (!animatedWidthsRef.current[goal.id]) {
        animatedWidthsRef.current[goal.id] = new Animated.Value(0);
      }
    });

    goals.forEach((goal) => {
      const progress = Math.min(
        (goal.currentValue / goal.targetValue) * 100,
        100
      );
      const animated = animatedWidthsRef.current[goal.id];
      if (animated) {
        Animated.timing(animated, {
          toValue: progress,
          duration: 600,
          useNativeDriver: false,
        }).start();
      }
    });
  }, [goals]);

  const saveGoals = async (newGoals: Goal[]) => {
    try {
      setGoals(newGoals);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newGoals));
    } catch (error) {
      console.error("Erro ao salvar metas:", error);
    }
  };

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

  const handleDelete = (id: string) => {
    const filtered = goals.filter((g) => g.id !== id);
    saveGoals(filtered);
    setModalVisible(false);
    setEditingGoal(null);
  };

  const openAddModal = () => {
    setEditingGoal(null);
    setName("");
    setDescription("");
    setValue("");
    setTargetDate("");
    setColor(PRESET_COLORS[0]);
    setModalVisible(true);
  };

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

  const handleDateChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 2 && cleaned.length <= 4)
      cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    else if (cleaned.length > 4)
      cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(
        4,
        6
      )}`;
    setTargetDate(cleaned);
  };

  const getTimeRemaining = (targetDate: string) => {
    const [dd, mm, yy] = targetDate.split("/").map(Number);
    const formattedYear = yy < 100 ? 2000 + yy : yy;
    const target = new Date(formattedYear, mm - 1, dd);
    const now = new Date();
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) return "Encerrada";

    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const days = totalDays - years * 365 - months * 30;

    const parts: string[] = [];
    if (years > 0) parts.push(`${years} ano${years > 1 ? "s" : ""}`);
    if (months > 0) parts.push(`${months} mês${months > 1 ? "es" : ""}`);
    if (days > 0) parts.push(`${days} dia${days > 1 ? "s" : ""}`);

    if (parts.length > 1) {
      const last = parts.pop();
      return `${parts.join(", ")} e ${last}`;
    }
    return parts[0] || "0 dias";
  };

  const ongoingGoals = goals.filter((g) => g.currentValue < g.targetValue);
  const completedGoals = goals.filter((g) => g.currentValue >= g.targetValue);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <Text style={styles.title}>METAS</Text>

        {ongoingGoals.length === 0 && completedGoals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Você ainda não tem metas cadastradas
            </Text>
            <Text style={styles.emptySubText}>
              Clique em "Incluir Meta" para começar.
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            {/* ------------------- Metas em andamento ------------------- */}
            {ongoingGoals.map((goal) => {
              const remaining = getTimeRemaining(goal.targetDate);
              const progress = Math.min(
                (goal.currentValue / goal.targetValue) * 100,
                100
              );

              const modo = modos[goal.id] || "mes";
              const [dd, mm, yy] = goal.targetDate.split("/").map(Number);
              const formattedYear = yy < 100 ? 2000 + yy : yy;
              const target = new Date(formattedYear, mm - 1, dd);
              const now = new Date();
              const diffDays = Math.max(
                Math.floor(
                  (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                ),
                1
              );
              const diffMonths = Math.max(diffDays / 30, 1);
              const faltando = Math.max(
                goal.targetValue - goal.currentValue,
                0
              );
              const valorPorTempo =
                modo === "mes" ? faltando / diffMonths : faltando / diffDays;

              const alternarModo = () =>
                setModos((prev) => ({
                  ...prev,
                  [goal.id]: prev[goal.id] === "mes" ? "dia" : "mes",
                }));

              const animated =
                animatedWidthsRef.current[goal.id] ?? new Animated.Value(0);
              const widthInterpolated = animated.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              });

              const scale =
                animatedScaleRef.current[goal.id] ?? new Animated.Value(1);
              const opacity = scale.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              });
              const translateY = scale.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              });

              return (
                <Animated.View
                  key={goal.id}
                  style={[
                    styles.goalBox,
                    {
                      backgroundColor: goal.color,
                      transform: [{ scale }, { translateY }],
                      opacity,
                    },
                  ]}
                >
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalTitle}>{goal.name}</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedGoal(goal);
                          setAddValueModal(true);
                        }}
                        style={styles.headerAddButton}
                      >
                        <Feather name="plus" size={18} color={Colors.white} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => openEditModal(goal)}>
                        <Feather
                          name="more-vertical"
                          size={20}
                          color={Colors.white}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.goalRemaining}>{remaining}</Text>

                  {(goal.description || valorPorTempo > 0) && (
                    <View style={styles.descAndSavingRow}>
                      {goal.description ? (
                        <Text
                          style={[styles.goalDesc, { flexShrink: 1, flex: 1 }]}
                          numberOfLines={2}
                        >
                          {goal.description}
                        </Text>
                      ) : (
                        <View style={{ flex: 1 }} />
                      )}

                      <View style={styles.inlineSavingRow}>
                        <Text style={styles.savingText}>
                          R${valorPorTempo.toFixed(2)} /{" "}
                          {modo === "mes" ? "mês" : "dia"}
                        </Text>
                        <TouchableOpacity onPress={alternarModo}>
                          <Feather
                            name="chevron-down"
                            size={16}
                            color={Colors.white}
                            style={{
                              transform: [
                                { rotate: modo === "mes" ? "0deg" : "180deg" },
                              ],
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  <View style={styles.progressBar}>
                    <Animated.View
                      style={[
                        styles.progressFill,
                        { width: widthInterpolated },
                      ]}
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
                </Animated.View>
              );
            })}

            {/* ------------------- Histórico ------------------- */}
            {completedGoals.length > 0 && (
              <>
                <Text style={[styles.title, { marginTop: 20 }]}>HISTÓRICO</Text>
                {completedGoals.map((goal) => {
                  const animated =
                    animatedWidthsRef.current[goal.id] ??
                    new Animated.Value(100);
                  const widthInterpolated = animated.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  });

                  const scale =
                    animatedScaleRef.current[goal.id] ?? new Animated.Value(1);
                  const opacity = scale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  });
                  const translateY = scale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  });

                  return (
                    <Animated.View
                      key={goal.id}
                      style={[
                        styles.goalBox,
                        {
                          backgroundColor: goal.color,
                          transform: [{ scale }, { translateY }],
                          opacity,
                        },
                      ]}
                    >
                      <View
                        style={{
                          position: "absolute",
                          top: 8,
                          alignSelf: "center",
                          backgroundColor: "#ffd700",
                          paddingHorizontal: 10,
                          paddingVertical: 2,
                          borderRadius: 10,
                        }}
                      >
                        <Text style={{ color: "#000", fontWeight: "bold" }}>
                          META CONCLUÍDA
                        </Text>
                      </View>

                      <View style={styles.goalHeader}>
                        <Text style={styles.goalTitle}>{goal.name}</Text>
                        <TouchableOpacity onPress={() => openEditModal(goal)}>
                          <Feather
                            name="more-vertical"
                            size={20}
                            color={Colors.white}
                          />
                        </TouchableOpacity>
                      </View>

                      {goal.description && (
                        <Text style={[styles.goalDesc, { marginTop: 24 }]}>
                          {goal.description}
                        </Text>
                      )}

                      <View style={styles.progressBar}>
                        <Animated.View
                          style={[
                            styles.progressFill,
                            { width: widthInterpolated },
                          ]}
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
                    </Animated.View>
                  );
                })}
              </>
            )}
          </ScrollView>
        )}

        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Text style={styles.addButtonText}>INCLUIR META</Text>
        </TouchableOpacity>

        {/* ------------------- Modal de criação/edição ------------------- */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ width: "100%" }}
              >
                <ScrollView
                  contentContainerStyle={{
                    alignItems: "center",
                    paddingVertical: 20,
                  }}
                >
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                      {editingGoal ? "Editar Meta" : "Nova Meta"}
                    </Text>

                    <TextInput
                      placeholder="Nome da meta"
                      placeholderTextColor="#555"
                      style={styles.input}
                      value={name}
                      onChangeText={setName}
                    />

                    <TextInput
                      placeholder="Descrição (opcional)"
                      placeholderTextColor="#555"
                      style={styles.input}
                      value={description}
                      onChangeText={setDescription}
                    />

                    <TextInput
                      placeholder="Valor que deseja atingir (R$)"
                      placeholderTextColor="#555"
                      style={styles.input}
                      keyboardType="numeric"
                      value={value}
                      onChangeText={setValue}
                    />

                    <TextInput
                      placeholder="Prazo (dd/mm/yy)"
                      placeholderTextColor="#555"
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

                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSave}
                    >
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

                    <TouchableOpacity
                      onPress={closeModal}
                      style={{ padding: 10 }}
                    >
                      <Text
                        style={{ color: Colors.white, textAlign: "center" }}
                      >
                        Cancelar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* ------------------- Modal de adicionar valor ------------------- */}
        <Modal visible={addValueModal} transparent animationType="fade">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Adicionar valor</Text>
                <TextInput
                  placeholder="Digite o valor"
                  placeholderTextColor="#555"
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
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  title: {
    textAlign: "center",
    fontSize: 34,
    fontWeight: "bold",
    color: Colors.brown,
    marginVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  emptyText: { color: "#aaa", fontSize: 16 },
  emptySubText: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginTop: 8,
    fontWeight: "600",
    textAlign: "center",
    maxWidth: "80%",
  },
  goalBox: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalTitle: { color: Colors.white, fontSize: 16, fontWeight: "bold" },
  goalRemaining: { color: "#fff", fontSize: 13 },
  goalDesc: { color: "#f8f8f8", fontSize: 13, marginBottom: 4 },
  progressBar: {
    height: 18,
    backgroundColor: "#fff8c2",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#6b4d1f" },
  progressTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  progressValue: { color: Colors.white, fontSize: 13 },
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
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    backgroundColor: "rgba(0,0,0,0.7)",
    width: "90%",
    borderRadius: 15,
    padding: 20,
    borderWidth: 3,
    borderColor: Colors.brown,
  },
  modalTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    color: "#000",
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  colorLabel: { color: Colors.white, marginBottom: 6, fontSize: 14 },
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
  selectedColor: { borderColor: Colors.white },
  saveButton: {
    backgroundColor: Colors.tintcolor,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  saveButtonText: {
    color: Colors.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#e63946",
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  headerAddButton: { backgroundColor: "#fff3", borderRadius: 20, padding: 6 },
  inlineSavingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  savingText: { color: Colors.white, fontSize: 13 },
  descAndSavingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
});

export default GoalsScreen;
