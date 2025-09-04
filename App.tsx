import React from 'react';
import {StatusBar, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BudgetProvider} from './src/context/BudgetContext';
import HomeScreen from './src/screens/HomeScreen'

export default function App() {
  return (
    <BudgetProvider>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{flex: 1, backgroundColor: '#0b5fff'}}>
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <HomeScreen />
        </View>
      </SafeAreaView>
    </BudgetProvider>
  );
}
