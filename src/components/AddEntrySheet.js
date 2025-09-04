import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  LOAN_CATEGORIES,
} from "../utils";

import Fonts from "../constants/fonts";

export default function AddEntrySheet({ visible, onClose, mode, onSubmit }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [timestamp, setTimestamp] = useState(Date.now());
  const [editDT, setEditDT] = useState(false);
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    if (visible) {
      const now = new Date();
      setAmount("");
      setCategory("");
      setNotes("");
      setTimestamp(now.getTime());
      setDateStr(formatAsDate(now));
      setTimeStr(formatAsTime(now));
      setEditDT(false);
    }
  }, [visible]);

  const normalizedMode = useMemo(
    () => (mode || "").toLowerCase().replace(/s$/, ""), // expense | income | loan
    [mode]
  );

  const cats = useMemo(() => {
    if (normalizedMode === "expense") return EXPENSE_CATEGORIES;
    if (normalizedMode === "income") return INCOME_CATEGORIES;
    if (normalizedMode === "loan") return LOAN_CATEGORIES;
    return [];
  }, [normalizedMode]);

  function parseAmountToFixed(v) {
    const n = parseFloat(String(v).replace(/[^0-9.]/g, ""));
    if (isNaN(n)) return "";
    return n.toFixed(2);
  }

  function onBlurAmount() {
    const v = parseAmountToFixed(amount);
    if (v !== "") setAmount(v);
  }

  function submit() {
    const n = parseFloat(amount);
    if (isNaN(n) || !category) return;

    const entry = {
      amount: Number(n.toFixed(2)),
      category,
      notes: notes?.trim() || "",
      timestamp,
      type: normalizedMode,
    };

    onSubmit?.(entry);
    onClose?.();
  }

  function applyDateTime() {
    const [y, m, d] = dateStr.split("-").map(Number);
    const [hh, mm] = timeStr.split(":").map(Number);
    const dt = new Date();
    if (!isNaN(y) && !isNaN(m) && !isNaN(d) && !isNaN(hh) && !isNaN(mm)) {
      dt.setFullYear(y);
      dt.setMonth(m - 1);
      dt.setDate(d);
      dt.setHours(hh);
      dt.setMinutes(mm);
      dt.setSeconds(0);
      dt.setMilliseconds(0);
      setTimestamp(dt.getTime());
      setEditDT(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <View style={styles.grip} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              <Text style={styles.title}>
                Add {normalizedMode.charAt(0).toUpperCase() + normalizedMode.slice(1)}
              </Text>

              {/* Amount */}
              <Text style={styles.label}>Amount</Text>
              <TextInput
                keyboardType="decimal-pad"
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                onBlur={onBlurAmount}
                style={styles.input}
              />

              {/* Category */}
              <Text style={styles.label}>Category</Text>
              <View style={styles.catWrap}>
                {cats.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.chip, category === c && styles.chipActive]}
                    onPress={() => setCategory(c)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        category === c && styles.chipTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Notes */}
              <Text style={styles.label}>Notes (optional)</Text>
              <TextInput
                placeholder="Add a note"
                value={notes}
                onChangeText={setNotes}
                style={[styles.input, { height: 44 }]}
              />

              {/* Date & Time */}
              <View style={styles.dtRow}>
                <Text style={styles.label}>Date & Time</Text>
                <TouchableOpacity onPress={() => setEditDT((s) => !s)}>
                  <Text style={styles.link}>
                    {editDT ? "Cancel" : "Change"}
                  </Text>
                </TouchableOpacity>
              </View>

              {!editDT ? (
                <Text style={styles.dtText}>
                  {formatHuman(new Date(timestamp))}
                </Text>
              ) : (
                <View style={styles.dtEditRow}>
                  <TextInput
                    value={dateStr}
                    onChangeText={setDateStr}
                    placeholder="YYYY-MM-DD"
                    style={[styles.input, styles.dtInput]}
                  />
                  <TextInput
                    value={timeStr}
                    onChangeText={setTimeStr}
                    placeholder="HH:MM"
                    style={[styles.input, styles.dtInput]}
                  />
                  <TouchableOpacity
                    style={[styles.btn, styles.btnPrimary]}
                    onPress={applyDateTime}
                  >
                    <Text style={styles.btnPrimaryText}>Set</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.btn, styles.btnGhost]}
                  onPress={onClose}
                >
                  <Text style={styles.btnGhostText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.btnPrimary]}
                  onPress={submit}
                >
                  <Text style={styles.btnPrimaryText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* Helpers */
function formatAsDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatAsTime(d) {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function formatHuman(d) {
  return `${formatAsDate(d)} · ${String(d.getHours()).padStart(
    2,
    "0"
  )}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/* Styles */
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "85%",
    minHeight: "30%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  grip: {
    alignSelf: "center",
    width: 44,
    height: 4,
    backgroundColor: "#e2e8f0",
    borderRadius: 2,
    marginVertical: 8,
  },
  title: { fontSize: 18, fontFamily: Fonts[700], marginBottom: 8 },
  label: {
    fontSize: 13,
    color: "#475569",
    marginTop: 8,
    marginBottom: 6,
    fontFamily: Fonts[600],
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: Fonts[400],
  },
  catWrap: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: "#0b5fff",
    borderColor: "#0b5fff",
  },
  chipText: { color: "#334155", fontFamily: Fonts[600] },
  chipTextActive: { color: "#fff" },
  dtRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  link: { color: "#0b5fff", fontFamily: Fonts[600] },
  dtText: {
    fontSize: 15,
    color: "#0f172a",
    marginTop: 6,
    fontFamily: Fonts[400],
  },
  dtEditRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  dtInput: { flex: 1, marginRight: 8 },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    marginBottom: 10,
  },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 8,
  },
  btnGhost: { backgroundColor: "#f1f5f9" },
  btnGhostText: { color: "#111827", fontFamily: Fonts[700] },
  btnPrimary: { backgroundColor: "#0b5fff" },
  btnPrimaryText: { color: "#fff", fontFamily: Fonts[700] },
});
