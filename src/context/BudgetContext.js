import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {computeBalance} from '../utils';
import {loadEntries, loadTotal, saveEntries, saveTotal} from '../storage';

const BudgetContext = createContext(null);

export function BudgetProvider({children}) {
  const [totalBase, setTotalBase] = useState(0);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    (async () => {
      const [t, e] = await Promise.all([loadTotal(), loadEntries()]);
      setTotalBase(t);
      setEntries(e);
    })();
  }, []);

  useEffect(() => { saveTotal(totalBase); }, [totalBase]);
  useEffect(() => { saveEntries(entries); }, [entries]);

  const balance = useMemo(() => computeBalance(totalBase, entries), [totalBase, entries]);

  const addEntry = (entry) => {
    setEntries(prev => [{...entry, id: String(Date.now())}, ...prev]);
  };

  const value = {
    totalBase, setTotalBase,
    entries, addEntry,
    balance,
  };
  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudget must be used within BudgetProvider');
  return ctx;
}
