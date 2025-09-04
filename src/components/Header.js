import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform} from 'react-native';
import {formatCurrency} from '../utils';
import {useBudget} from '../context/BudgetContext';
import Fonts from '../constants/fonts';

export default function Header() {
  const {balance, totalBase, setTotalBase} = useBudget();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(String(totalBase || ''));

  useEffect(() => {
    setInput(String(totalBase || ''));
  }, [totalBase]);

  const submit = () => {
    const n = parseFloat(input);
    if (!isNaN(n)) {
      setTotalBase(Number(n.toFixed(2)));
      setOpen(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>Total</Text>
        <TouchableOpacity onPress={() => {setInput(String(totalBase || '')); setOpen(true);}}>
          <Text style={styles.edit}>Set Monthly Total</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.amount}>₹ {formatCurrency(balance)}</Text>

      <Modal visible={open} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex:1}}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Monthly Total</Text>
              <TextInput
                keyboardType="decimal-pad"
                value={input}
                onChangeText={setInput}
                placeholder="Enter amount"
                style={styles.input}
              />
              <View style={styles.modalRow}>
                <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={() => setOpen(false)}>
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.save]} onPress={submit}>
                  <Text style={[styles.btnText, {color:'#fff'}]}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 16, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#0b5fff' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: 'rgba(255,255,255,0.9)', fontSize: 14,fontFamily:Fonts[500] },
  edit: { color: '#fff', fontSize: 13, textDecorationLine: 'underline' ,fontFamily:Fonts[500]},
  amount: { color:'#fff', fontSize: 36, marginTop: 6, fontFamily:Fonts[700] },

  modalBackdrop: { flex:1, backgroundColor:'rgba(0,0,0,0.35)', justifyContent:'flex-end' },
  modalCard: { backgroundColor:'#fff', padding:16, borderTopLeftRadius:20, borderTopRightRadius:20 },
  modalTitle: { fontSize: 18, marginBottom: 8, fontFamily:Fonts[700] },
  input: { borderWidth:1, borderColor:'#ddd', borderRadius:10, paddingHorizontal:12, paddingVertical:10, fontSize:16, marginBottom:12 },
  modalRow: { flexDirection:'row', justifyContent:'flex-end' },
  btn: { paddingHorizontal:14, paddingVertical:10, borderRadius:10, marginLeft:8 },
  cancel: { backgroundColor:'#eee' },
  save: { backgroundColor:'#0b5fff' },
  btnText: { color:'#111',fontFamily:Fonts[700] },
});
