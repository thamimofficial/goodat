export function formatCurrency(n) {
  const val = Number.isFinite(n) ? n : 0;
  return val.toFixed(2);
}

export function formatDateTime(ts) {
  const d = new Date(ts);
  const date = new Intl.DateTimeFormat('en-IN', {
    year: 'numeric', month: 'short', day: '2-digit'
  }).format(d);
  const time = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true
  }).format(d);
  return `${date} · ${time}`;
}

export const EXPENSE_CATEGORIES = [
  'Food','Grocery','Medical','Social','Education','Investment','Traffic','Bills','Gits','Shopping','Rentels','Other'
];

export const INCOME_CATEGORIES = [
  'Salary','Invest','Business','Interest','Extra Income','Other'
];

export const LOAN_CATEGORIES = [
  'Loan','Borrow' // Loan reduces, Borrow increases total
];

export function computeBalance(totalBase, entries) {
  let bal = totalBase || 0;
  for (const e of entries) {
    if (e.type === 'expense') {
      bal -= e.amount;
    } else if (e.type === 'income') {
      bal += e.amount;
    } else if (e.type === 'loan') {
      if (e.category === 'Loan') bal -= e.amount;
      if (e.category === 'Borrow') bal += e.amount;
    }
  }
  return bal;
}
