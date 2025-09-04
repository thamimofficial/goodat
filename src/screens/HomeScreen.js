import React, {useMemo, useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Header from '../components/Header';
import SegmentedTabs from '../components/SegmentedTabs';
import EntryList from '../components/EntryList';
import AddEntrySheet from '../components/AddEntrySheet';
import {useBudget} from '../context/BudgetContext';

export default function HomeScreen(){
  const {entries, addEntry} = useBudget();
  const [tab, setTab] = useState('Expenses');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(()=>{
    if (tab === 'Expenses') return entries.filter(e=>e.type==='expense');
    if (tab === 'Income') return entries.filter(e=>e.type==='income');
    return entries.filter(e=>e.type==='loan');
  }, [entries, tab]);

  return (
    <View style={{flex:1}}>
      <Header />
      <SegmentedTabs value={tab} onChange={setTab} />
      <EntryList data={filtered} type={tab} />

      <TouchableOpacity style={styles.fab} onPress={()=>setOpen(true)}>
        <Text style={styles.fabPlus}>＋</Text>
      </TouchableOpacity>

      <AddEntrySheet
        visible={open}
        onClose={()=>setOpen(false)}
        mode={tab}
        onSubmit={addEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: { position:'absolute', right:16, bottom:24, width:56, height:56, borderRadius:28, backgroundColor:'#0b5fff', alignItems:'center', justifyContent:'center', shadowColor:'#000', shadowOpacity:0.2, shadowRadius:8, elevation:5 },
  fabPlus: { color:'#fff', fontSize:32, lineHeight:32, marginTop:-2 },
});
