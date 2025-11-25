import Colors from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export interface PieSlice {
  id: string;
  value: number;
  color: string;
  text: string;
  percentage: number;
  sliceThickness?: number;
}

interface DashboardProps {
  expenses: any[];
  incomes: any[];
  dataType: "expense" | "income";
  setDataType: (type: "expense" | "income") => void;
  selectedPeriod: number;
  setSelectedPeriod: (period: number) => void;
  selectedSlice: string | null;
  onSelectSlice: (sliceId: string | null) => void;
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
  tv: Colors.tv,
  quest: Colors.quest,
  salario: Colors.salario,
  presente: Colors.presente,
  bonus: Colors.bonus,
  other: Colors.tvIncome,
};

const Dashboard: React.FC<DashboardProps> = ({
  expenses,
  incomes,
  dataType,
  setDataType,
  selectedPeriod,
  setSelectedPeriod,
  selectedSlice,
  onSelectSlice,
}) => {
  const [pieData, setPieData] = useState<PieSlice[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const getLastThreeMonths = () => {
    const now = new Date();
    const months = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: d.getMonth(),
        year: d.getFullYear(),
        name: d.toLocaleString("default", { month: "long" }),
      });
    }
    return months;
  };

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

  useEffect(() => {
    const generatePieData = () => {
      const data: any[] = dataType === "expense" ? expenses : incomes;

      let start: Date;
      let end: Date;

      if (selectedPeriod === 0) {
        ({ start, end } = getCurrentWeekRange());
      } else {
        const monthData = getLastThreeMonths()[selectedPeriod - 1];
        start = new Date(monthData.year, monthData.month, 1);
        end = new Date(monthData.year, monthData.month + 1, 0, 23, 59, 59, 999);
      }

      const filteredData = data.filter((item) => {
        const [day, month, year] = item.date.split("/").map(Number);
        const fullYear = year < 100 ? 2000 + year : year;
        const itemDate = new Date(fullYear, month - 1, day);
        return itemDate >= start && itemDate <= end;
      });

      const grouped: Record<string, { value: number; name: string }> = {};
      filteredData.forEach((item) => {
        const category = item.category || "other";
        if (!grouped[category])
          grouped[category] = { value: 0, name: item.category };
        grouped[category].value += Number(item.amount);
      });

      const totalValue = Object.values(grouped).reduce(
        (acc, val) => acc + val.value,
        0
      );

      const chartData: PieSlice[] = Object.keys(grouped).map((category) => ({
        id: category,
        value: grouped[category].value,
        color: categoryColors[category] || Colors.grey,
        text: grouped[category].name,
        percentage:
          totalValue > 0 ? (grouped[category].value / totalValue) * 100 : 0,
        sliceThickness: selectedSlice === category ? 35 : 20,
      }));

      setPieData(chartData);
    };

    generatePieData();
  }, [expenses, incomes, dataType, selectedPeriod, selectedSlice]);

  return (
    <View style={styles.container}>
      {/* Gráfico alinhado à direita e menor */}
      <View style={styles.chartWrapper}>
        <View style={styles.chartContainer}>
          <PieChart
            data={
              pieData.length > 0
                ? pieData
                : [
                    {
                      id: "empty",
                      value: 1,
                      color: "transparent",
                      text: "",
                      percentage: 100,
                    },
                  ]
            }
            donut
            showGradient
            sectionAutoFocus={false} // desativa foco automático do gifted-charts
            radius={width * 0.20} // 25% da largura da tela
            innerRadius={width * 0.09} // 15% da largura
            innerCircleColor={Colors.background}
            centerLabelComponent={() => {
              if (!selectedSlice) {
                return (
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.darkBrown,
                        fontWeight: "bold",
                      }}
                    >
                      {selectedPeriod === 0
                        ? "Semana"
                        : getLastThreeMonths()[selectedPeriod - 1].name}
                    </Text>
                    <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
                      Resumo
                    </Text>
                  </View>
                );
              }

              const slice = pieData.find((p) => p.id === selectedSlice);
              if (!slice) return null;

              return (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text
                    style={{
                      color: Colors.darkBrown,
                      fontSize: 14,
                      fontWeight: "700",
                    }}
                  >
                    {slice.text}
                  </Text>
                  <Text style={{ color: Colors.textSecondary, fontSize: 14 }}>
                    R${slice.value.toFixed(2)}
                  </Text>
                  <Text style={{ color: Colors.textSecondary, fontSize: 14 }}>
                    {slice.percentage.toFixed(0)}%
                  </Text>
                </View>
              );
            }}
            onPress={(slice: PieSlice) => {
              // Mantém o destaque até clicar em outro slice
              if (slice.id !== "empty" && slice.id !== selectedSlice) {
                onSelectSlice(slice.id);
              }
            }}
          />

          {/* Botão fixo no canto superior esquerdo do gráfico */}
          <View style={styles.chartButtonWrapper}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons
                name={
                  dataType === "expense"
                    ? "arrow-down-circle-outline"
                    : "arrow-up-circle-outline"
                }
                size={30}
                color={Colors.darkBrown}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalPanel}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 30 }}
            >
              <Text style={styles.modalTitle}>Selecionar Período</Text>

              {getLastThreeMonths().map((m, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalButton,
                    {
                      backgroundColor:
                        selectedPeriod === index + 1
                          ? Colors.tintcolor
                          : Colors.grey,
                    },
                  ]}
                  onPress={() => {
                    setSelectedPeriod(index + 1);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalButtonText}>{m.name}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor:
                      selectedPeriod === 0 ? Colors.tintcolor : Colors.grey,
                  },
                ]}
                onPress={() => {
                  setSelectedPeriod(0);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Última Semana</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: Colors.lightBrown, marginTop: 10 },
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Fechar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 10,
  },
  chartWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  modalButtonContainer: {
    position: "absolute",
    top: 14,
    left: 20,
    zIndex: 10,
  },
  chartButtonWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  modalPanel: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 15,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    color: Colors.darkBrown,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  modalButton: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  chartContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: {
    color: Colors.white,
    textAlign: "center",
    fontWeight: "600",
  },
});
