import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BudgetProvider } from './src/context/BudgetContext';
import HomeScreen from './src/screens/HomeScreen';

// ✅ Import AdMob initializer
import mobileAds from 'react-native-google-mobile-ads';

export default function App() {
  useEffect(() => {
    // Initialize Google Mobile Ads SDK
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('AdMob initialized:', adapterStatuses);
      });
  }, []);

  return (
    <BudgetProvider>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0b5fff' }}>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <HomeScreen />
        </View>
      </SafeAreaView>
    </BudgetProvider>
  );
}
