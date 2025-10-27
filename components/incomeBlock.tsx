import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Modal } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type IncomeType = {
  id: string;
  name: string;
  amount: string;
};

const INCOME_KEY = "@my_income";

const IncomeBlock = () => {
  const [incomeList, setIncomeList] = React.useState<IncomeType[]>([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newAmount, setNewAmount] = React.useState("");

  // Carrega dados do AsyncStorage
  React.useEffect(() => {
    const loadIncome = async () => {
      const json = await AsyncStorage.getItem(INCOME_KEY);
      if (json) setIncomeList(JSON.parse(json));
    };
    loadIncome();
  }, []);

  // Salva dados no AsyncStorage
  const saveIncome = async (list: IncomeType[]) => {
    setIncomeList(list);
    await AsyncStorage.setItem(INCOME_KEY, JSON.stringify(list));
  };

  const addIncome = () => {
    if (!newName || !newAmount) return;
    const newItem: IncomeType = {
      id: (incomeList.length + 1).toString(),
      name: newName,
      amount: newAmount,
    };
    saveIncome([newItem, ...incomeList]);
    setModalVisible(false);
    setNewName("");
    setNewAmount("");
  };

  const renderItem = ({ item }: { item: IncomeType }) => {
    const amountParts = item.amount.split(".");
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={{ color: Colors.white }}>{item.name}</Text>
          <TouchableOpacity onPress={() => {}}>
            <Feather name="more-horizontal" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.amount}>
          R${amountParts[0]}
          <Text style={styles.amountDecimal}>{amountParts[1]}</Text>
        </Text>
      </View>
    );
  };

  return (
    <View style={{ marginVertical: 20 }}>
      <Text style={styles.title}>
        My <Text style={{ fontWeight: "700" }}>Income</Text>
      </Text>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addButton}
      >
        <Feather name="plus" size={18} color="#ccc" />
        <Text style={{ color: Colors.white, fontSize: 14, marginLeft: 5 }}>
          Adicionar
        </Text>
      </TouchableOpacity>

      <FlatList
        data={incomeList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10 }}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ color: Colors.white, fontSize: 16, marginBottom: 10 }}>
              Adicionar Renda
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

            <TouchableOpacity onPress={addIncome} style={styles.modalButton}>
              <Text style={{ color: Colors.white, textAlign: "center" }}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ padding: 10 }}
            >
              <Text style={{ color: Colors.white, textAlign: "center" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default IncomeBlock;

const styles = StyleSheet.create({
  title: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.grey,
    padding: 20,
    borderRadius: 20,
    marginRight: 15,
    width: 150,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  amountDecimal: {
    fontSize: 12,
    fontWeight: "400",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#666",
    borderStyle: "dashed",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
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
    width: "85%",
  },
  input: {
    color: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.white,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: Colors.tintcolor,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
});
