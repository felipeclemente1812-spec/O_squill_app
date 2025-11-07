import Colors from "@/constants/Colors";
import { AntDesign, FontAwesome, FontAwesome5, SimpleLineIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";

const Layout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: Colors.grey,
            position: "absolute",
            bottom: 15,
            left: 70,
            right: 70,
            height: 55,
            borderRadius: 40,
            borderWidth: 1,
            borderColor: "#333",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          },
          tabBarShowLabel: false,
          tabBarInactiveTintColor: "#999",
          tabBarActiveTintColor: Colors.white,
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
      <StatusBar style="light" />
    </>
  );
};

export default Layout;
