import Colors from "@/constants/Colors";
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const Layout = () => {
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <Tabs
          screenOptions={{
            tabBarStyle: {
  backgroundColor: Colors.grey,
  position: "absolute", // mantém flutuante
  bottom: Platform.OS === "ios" ? 20 : 15,
  left: 60,
  right: 60,
  height: 55,
  borderRadius: 40,
  borderWidth: 1,
  borderColor: "#333",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 6,
  zIndex: 999, // garante que fique acima
},

            tabBarShowLabel: false,
            tabBarInactiveTintColor: "#000000ff",
            tabBarActiveTintColor: '#743b0dff',
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              tabBarIcon: ({ color, focused }) => (
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: focused ? Colors.tintcolor : Colors.grey,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SimpleLineIcons name="pie-chart" size={22} color={color} />
                </View>
              ),
            }}
          />

          <Tabs.Screen
            name="goals"
            options={{
              tabBarIcon: ({ color, focused }) => (
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: focused ? Colors.tintcolor : Colors.grey,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome5 name="bullseye" size={22} color={color} />
                </View>
              ),
            }}
          />

          <Tabs.Screen
            name="mascot"
            options={{
              tabBarIcon: ({ color, focused }) => (
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: focused ? Colors.tintcolor : Colors.grey,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome5 name="brush" size={22} color={color} />
                </View>
              ),
            }}
          />

          <Tabs.Screen
            name="profile"
            options={{
              tabBarIcon: ({ color, focused }) => (
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: focused ? Colors.tintcolor : Colors.grey,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome name="user-o" size={22} color={color} />
                </View>
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>

      <StatusBar style="light" />
    </>
  );
};

export default Layout;
