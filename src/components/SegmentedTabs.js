import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Fonts from '../constants/fonts';

export default function SegmentedTabs({value, onChange}){
  const tabs = ['Expenses','Income','Loan'];
  return (
    <View style={styles.wrap}>
      {tabs.map(t => {
        const active = value === t;
        return (
          <TouchableOpacity
            key={t}
            style={[styles.tab, active && styles.activeTab]}
            onPress={() => onChange(t)}>
            <Text style={[styles.text, active && styles.activeText]}>{t}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection:'row', margin:16, backgroundColor:'#eef2ff', padding:6, borderRadius:14 },
  tab: { flex:1, paddingVertical:10, borderRadius:10, alignItems:'center' },
  activeTab: { backgroundColor:'#0b5fff' },
  text: { color:'#334155', fontWeight:'600',fontFamily:Fonts[600] },
  activeText: { color:'#fff',fontFamily:'Outfit-Bold' },
});
