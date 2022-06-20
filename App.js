import React, { Component } from "react";
import Navigation from "./src/navigation/navigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {<Navigation />}
      </GestureHandlerRootView>
    </NavigationContainer>
  );
}
