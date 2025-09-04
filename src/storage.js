import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  TOTAL: '@bt_total_budget',
  ENTRIES: '@bt_entries',
};

export async function saveTotal(total) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TOTAL, String(total));
  } catch (e) { /* ignore */ }
}

export async function loadTotal() {
  try {
    const v = await AsyncStorage.getItem(STORAGE_KEYS.TOTAL);
    return v ? parseFloat(v) : 0;
  } catch (e) {
    return 0;
  }
}

export async function saveEntries(entries) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  } catch (e) { /* ignore */ }
}

export async function loadEntries() {
  try {
    const v = await AsyncStorage.getItem(STORAGE_KEYS.ENTRIES);
    return v ? JSON.parse(v) : [];
  } catch (e) {
    return [];
  }
}
