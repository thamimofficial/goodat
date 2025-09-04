import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {formatCurrency, formatDateTime} from '../utils';
import Fonts from '../constants/fonts';

export default function EntryList({data, type}){
  if (!data.length) return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>No records yet</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      contentContainerStyle={{paddingBottom: 120}}
      renderItem={({item}) => <Row item={item} type={type} />}
    />
  );
}

function Row({item, type}){
  const isMinus = type === 'Expenses' || (type === 'Loan' && item.category === 'Loan');
  return (
    <View style={styles.row}>
      <View style={{flex:1}}>
        <Text style={styles.cat}>{item.category}</Text>
        {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
        <Text style={styles.date}>{formatDateTime(item.timestamp)}</Text>
      </View>
      <View>
        <Text style={[styles.amt, isMinus ? styles.minus : styles.plus]}>
          {isMinus ? '-' : '+'} ₹ {formatCurrency(item.amount)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { padding: 24, alignItems:'center' },
  emptyText: { color:'#64748b', fontFamily: Fonts[400] },
  row: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:16, paddingVertical:14, borderBottomWidth:1, borderBottomColor:'#eef2ff' },
  cat: { fontSize:16,fontFamily:Fonts[600], color:'#111827' },
  notes: { fontSize:13, color:'#475569', marginTop:2, fontFamily:Fonts[400] },
  date: { fontSize:12, color:'#94a3b8', marginTop:4 ,fontFamily:Fonts[400]},
  amt: { fontSize:16, fontFamily:Fonts[700] },
  minus: { color:'#ef4444' },
  plus: { color:'#16a34a' },
});
