import React, { Component } from 'react';
import HomePage from './js/pages/HomaPage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>{
        <HomePage/>
        }
      </GestureHandlerRootView>
    );
}